import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const deviceId = formData.get("device_id");
    const fileType = formData.get("fileType");
    const file = formData.get("file");

    if (!deviceId || !fileType || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert file to a Buffer
    const fileBuffer = await (file as File).arrayBuffer();
    const fileBlob = new Blob([fileBuffer], { type: (file as File).type });

    // Upload file to Supabase Storage
    const filePath = `media/${deviceId}/${(file as File).name}`;
    const { error: uploadError } = await supabase.storage
      .from("vending-media")
      .upload(filePath, fileBlob, {
        cacheControl: "3600", // Cache for 1 hour
        upsert: false, // Do not overwrite existing files
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // Get public URL of the uploaded file
    const { data: publicUrlData } = await supabase.storage
      .from("vending-media")
      .getPublicUrl(filePath);

    // Save file metadata to the database
    const { error: dbError } = await supabase
      .from("media_files")
      .insert([{
        device_id: deviceId,
        file_url: publicUrlData.publicUrl,
        file_type: fileType,
      }]);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save file metadata" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "File uploaded successfully", url: publicUrlData.publicUrl },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}