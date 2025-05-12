import { NextRequest, NextResponse } from 'next/server';
import { verifyHardwareAuth } from '@/lib/hardware-auth';
import { supabase } from '@/lib/supabase';

// Define feedback item type
interface FeedbackItem {
  id: string;
  device_id: string;
  machine_id: string;
  rating: number;
  comments: string;
  submitted_at: string;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Parse request body first to check for test_mode
    const body = await req.json();
    const { machineId, rating, comments, test_mode } = body;

    // Handle test mode for development
    if (test_mode === true) {
      console.log('Feedback endpoint running in test mode');

      // Validate test mode input
      if (!machineId || rating === undefined) {
        return NextResponse.json(
          {
            error: 'Machine ID and rating are required even in test mode',
          },
          { status: 400 }
        );
      }

      // Validate rating range
      if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        return NextResponse.json(
          {
            error: 'Rating must be an integer between 1 and 5',
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          message: 'Feedback recorded successfully (TEST MODE)',
          feedback_id: 'test-feedback-' + Date.now(),
        },
        { status: 201 }
      );
    }

    // For non-test mode, verify auth token
    const result = await verifyHardwareAuth(req);

    if (!result) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Validate required fields
    if (!machineId || rating === undefined) {
      return NextResponse.json(
        {
          error: 'Machine ID and rating are required',
        },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        {
          error: 'Rating must be an integer between 1 and 5',
        },
        { status: 400 }
      );
    }

    // Validate machine ID matches the authenticated device
    if (machineId !== result.device?.machine_id) {
      return NextResponse.json(
        {
          error: "Machine ID doesn't match the authenticated device",
        },
        { status: 400 }
      );
    }

    // Record feedback in database
    const { error } = await supabase.from('customer_feedback').insert({
      device_id: result.device?.id,
      machine_id: machineId,
      rating,
      comments: comments || '',
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
    }

    // Update device average rating
    // First get all ratings for this device
    const { data: allRatings, error: ratingsError } = await supabase
      .from('customer_feedback')
      .select('rating')
      .eq('device_id', result.device?.id);

    if (!ratingsError && allRatings && allRatings.length > 0) {
      // Calculate new average
      const totalRating = allRatings.reduce((sum, item) => sum + item.rating, 0);
      const avgRating = totalRating / allRatings.length;

      // Update device record
      await supabase
        .from('devices')
        .update({
          avg_rating: avgRating,
          total_ratings: allRatings.length,
        })
        .eq('id', result.device?.id);
    }

    return NextResponse.json(
      {
        message: 'Feedback recorded successfully',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error recording feedback:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// export async function GET(req: NextRequest): Promise<Response> {
//   try {
//     // Check for test_mode
//     const url = new URL(req.url);
//     const testMode = url.searchParams.get('test_mode') === 'true';

//     if (testMode) {
//       console.log('Feedback endpoint running in test mode');
//       // Generate test feedback data
//       const currentTime = new Date();
//       const testFeedback = [
//         {
//           id: 'test-feedback-1',
//           device_id: '1',
//           machine_id: 'TEST-MACHINE-001',
//           rating: 5,
//           comments: 'Great service!',
//           submitted_at: currentTime.toISOString(),
//         },
//         {
//           id: 'test-feedback-2',
//           device_id: '1',
//           machine_id: 'TEST-MACHINE-001',
//           rating: 4,
//           comments: 'Good experience overall',
//           submitted_at: new Date(currentTime.getTime() - 3600000).toISOString(), // 1 hour ago
//         },
//         {
//           id: 'test-feedback-3',
//           device_id: '1',
//           machine_id: 'TEST-MACHINE-001',
//           rating: 5,
//           comments: 'Awesome cleaning!',
//           submitted_at: new Date(currentTime.getTime() - 7200000).toISOString(), // 2 hours ago
//         },
//       ];

//       return NextResponse.json(
//         {
//           avg_rating: 4.7,
//           total_ratings: 3,
//           recent_feedback: testFeedback,
//         },
//         { status: 200 }
//       );
//     }

//     // For non-test mode, verify auth token
//     const { authenticated, response, device } = await verifyHardwareAuth(req);

//     if (!authenticated || !device) {
//       return (
//         response || NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
//       );
//     }

//     // Get recent feedback for this device
//     const { data: recentFeedback, error } = await supabase
//       .from('customer_feedback')
//       .select('*')
//       .eq('device_id', device.id)
//       .order('submitted_at', { ascending: false })
//       .limit(50);

//     if (error) {
//       return NextResponse.json(
//         { error: 'Failed to fetch feedback history' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       {
//         avg_rating: device.avg_rating || 0,
//         total_ratings: device.total_ratings || 0,
//         recent_feedback: (recentFeedback as FeedbackItem[]) || [],
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error('Error fetching feedback history:', err);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
