"use client"

import { SiteHeader } from "../components/site-header";
import Footer from "../components/footer";

export default function Terms() {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-blue-900 text-white p-8">
                <SiteHeader />
          <div className="max-w-4xl mx-auto pt-20">
            <h1 className="text-3xl font-bold mb-6">Terms and Conditions - HelmetPro Solutions</h1>
    
            <ol className="list-decimal space-y-6 pl-6">
              <li>
                <h2 className="text-xl font-semibold mb-2">Acceptance of Terms:</h2>
                <p>
                  By accessing and using the HelmetPro Solutions website (hereinafter &ldquo;the Website&rdquo;), you agree to be bound
                  by these Terms and Conditions (hereinafter &ldquo;Terms&rdquo;). If you do not agree with any part of these Terms, you
                  must not use the Website.
                </p>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Product Information and Availability:</h2>
                <p>
                  HelmetPro Solutions strives to provide accurate and up-to-date information regarding its products.
                  However, we do not warrant that product descriptions, images, or other content are error-free.
                </p>
                <p>
                  Product availability is subject to change without notice. We reserve the right to limit or discontinue
                  products at any time.
                </p>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Ordering and Payment:</h2>
                <ul className="list-disc pl-6">
                  <li>
                    By placing an order, you confirm that you are legally capable of entering into a binding contract.
                  </li>
                  <li>All orders are subject to acceptance by HelmetPro Solutions.</li>
                  <li>Payment must be made through the methods specified on the Website.</li>
                  <li>Prices are subject to change without notice.</li>
                </ul>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Shipping and Delivery:</h2>
                <ul className="list-disc pl-6">
                  <li>Shipping and delivery times are estimates and are not guaranteed.</li>
                  <li>
                    HelmetPro Solutions is not responsible for delays caused by third-party carriers or events beyond our
                    control.
                  </li>
                  <li>
                    Risk of loss and title for products purchased from the Website pass to you upon delivery to the carrier.
                  </li>
                </ul>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Returns and Refunds:</h2>
                <p>
                  Our return and refund policy is outlined separately on the Website. Please refer to this policy for
                  detailed information.
                </p>
                <p>Returns are subject to specific conditions and may require prior authorization.</p>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Intellectual Property:</h2>
                <p>
                  All content on the Website, including but not limited to text, images, logos, and trademarks, is the
                  property of HelmetPro Solutions or its licensors and is protected by intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, or modify any content from the Website without our express written
                  permission.
                </p>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">User Conduct:</h2>
                <ul className="list-disc pl-6">
                  <li>You agree to use the Website only for lawful purposes.</li>
                  <li>
                    You must not engage in any activity that may disrupt or interfere with the operation of the Website.
                  </li>
                  <li>You must not upload or transmit any harmful or offensive content.</li>
                </ul>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Limitation of Liability:</h2>
                <p>
                  HelmetPro Solutions shall not be liable for any direct, indirect, incidental, consequential, or punitive
                  damages arising from your use of the Website or any products purchased through the Website.
                </p>
                <p>Our liability is limited to the extent permitted by applicable law.</p>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Indemnification:</h2>
                <p>
                  You agree to indemnify and hold HelmetPro Solutions harmless from any claims, damages, or losses arising
                  from your use of the Website or your violation of these Terms.
                </p>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Governing Law:</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction].</p>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Changes to Terms:</h2>
                <p>
                  HelmetPro Solutions reserves the right to modify these Terms at any time. Changes will be posted on the
                  Website, and your continued use of the Website constitutes acceptance of the modified Terms.
                </p>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Contact Information:</h2>
                <p>If you have any questions about these Terms, please contact us at: [Your Contact Information].</p>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Warranties:</h2>
                <p>All warranties are expressed within the product description page.</p>
                <p>HelmetPro solutions does not express or imply any other warranties.</p>
              </li>
    
              <li>
                <h2 className="text-xl font-semibold mb-2">Severability:</h2>
                <p>
                  If any provision of these terms is deemed invalid, the remaining provisions will continue to be in full
                  effect.
                </p>
              </li>
            </ol>
          </div>
        </div>
        <Footer />
        </>
      )
    }