/**
 * HelmetPro Firmware Update Client Example
 * For ESP32 microcontrollers
 * 
 * This example demonstrates how to implement OTA firmware updates
 * by connecting to the HelmetPro firmware API.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Update.h>
#include <MD5Builder.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API Configuration
const char* API_URL = "https://your-helmetpro-server.com/api/hardware/firmware";
const char* DEVICE_TOKEN = "YOUR_DEVICE_TOKEN"; // Auth token for the device
const char* CURRENT_VERSION = "1.0.0";          // Current firmware version
const char* DEVICE_MODEL = "HelmetPro Standard";

// Buffer for storing response
char responseBuffer[1024];
bool updateInProgress = false;

// Function declarations
bool checkForUpdates();
bool downloadAndInstallUpdate(const char* url, const char* expectedMD5);
bool verifyMD5(const char* expectedMD5);

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\nHelmetPro Firmware Update Client");
  Serial.printf("Current version: %s\n", CURRENT_VERSION);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("Connected to WiFi with IP: ");
  Serial.println(WiFi.localIP());
  
  // Check for firmware updates
  if (checkForUpdates()) {
    Serial.println("Update completed successfully!");
    ESP.restart();
  } else {
    Serial.println("No updates available or update failed");
  }
}

void loop() {
  // Your main code here
  delay(1000);
}

/**
 * Check for available firmware updates
 * @return true if update was successful, false otherwise
 */
bool checkForUpdates() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return false;
  }
  
  HTTPClient http;
  MD5Builder md5;
  
  // Prepare URL with version parameter
  String url = String(API_URL) + "?version=" + CURRENT_VERSION;
  
  Serial.print("Checking for updates at: ");
  Serial.println(url);
  
  // Begin HTTP request
  http.begin(url);
  
  // Add authorization header
  http.addHeader("Authorization", String("Bearer ") + DEVICE_TOKEN);
  http.addHeader("Content-Type", "application/json");
  
  // Send the request
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    // Update available
    String payload = http.getString();
    Serial.println("Update available!");
    
    // Parse JSON response
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload);
    
    if (error) {
      Serial.print("Failed to parse response: ");
      Serial.println(error.c_str());
      http.end();
      return false;
    }
    
    // Extract firmware info
    const char* newVersion = doc["version"];
    const char* binUrl = doc["bin_url"];
    const char* md5Hash = doc["md5_hash"];
    const char* releaseNotes = doc["release_notes"];
    
    if (!newVersion || !binUrl || !md5Hash) {
      Serial.println("Invalid firmware data in response");
      http.end();
      return false;
    }
    
    Serial.printf("New version: %s\n", newVersion);
    Serial.printf("Release notes: %s\n", releaseNotes ? releaseNotes : "None");
    
    // Download and install update
    bool updateResult = downloadAndInstallUpdate(binUrl, md5Hash);
    http.end();
    return updateResult;
    
  } else if (httpCode == 204) {
    // No update available
    Serial.println("No updates available");
    http.end();
    return false;
  } else {
    // Error
    Serial.print("Update check failed with HTTP code: ");
    Serial.println(httpCode);
    Serial.println(http.getString());
    http.end();
    return false;
  }
}

/**
 * Download and install firmware update
 * @param url URL to download the firmware from
 * @param expectedMD5 Expected MD5 hash of the firmware
 * @return true if successful, false otherwise
 */
bool downloadAndInstallUpdate(const char* url, const char* expectedMD5) {
  if (updateInProgress) {
    Serial.println("Update already in progress");
    return false;
  }
  
  HTTPClient http;
  Serial.print("Downloading update from: ");
  Serial.println(url);
  
  http.begin(url);
  
  // Start request
  int httpCode = http.GET();
  
  if (httpCode != 200) {
    Serial.print("Download failed with HTTP code: ");
    Serial.println(httpCode);
    http.end();
    return false;
  }
  
  // Get size of update
  int contentLength = http.getSize();
  Serial.print("Update size: ");
  Serial.print(contentLength);
  Serial.println(" bytes");
  
  if (contentLength <= 0) {
    Serial.println("Invalid content length");
    http.end();
    return false;
  }
  
  // Check if enough space
  if (!Update.begin(contentLength)) {
    Serial.println("Not enough space for update");
    http.end();
    return false;
  }
  
  // Set MD5 for verification later
  Update.setMD5(expectedMD5);
  updateInProgress = true;
  
  // Create buffer for the update
  uint8_t buff[1024] = {0};
  WiFiClient *client = http.getStreamPtr();
  size_t written = 0;
  
  // Read all data from server
  Serial.println("Downloading and installing update...");
  
  while (http.connected() && (written < contentLength)) {
    // Get available data size
    size_t available = client->available();
    
    if (available) {
      // Read up to the buffer size
      size_t readBytes = client->readBytes(buff, min(available, sizeof(buff)));
      
      // Write to Update
      if (Update.write(buff, readBytes) != readBytes) {
        Serial.println("Write error during update");
        Update.abort();
        updateInProgress = false;
        http.end();
        return false;
      }
      
      written += readBytes;
      
      // Print progress
      if (written % 10240 == 0) {
        Serial.printf("Progress: %u of %d bytes (%.1f%%)\n", 
                    written, contentLength, (written * 100.0) / contentLength);
      }
    }
    
    // Small delay
    delay(1);
  }
  
  Serial.println();
  
  if (written != contentLength) {
    Serial.println("Download incomplete");
    Update.abort();
    updateInProgress = false;
    http.end();
    return false;
  }
  
  // End the update
  if (!Update.end()) {
    Serial.print("Update failed with error: ");
    Serial.println(Update.getError());
    updateInProgress = false;
    http.end();
    return false;
  }
  
  updateInProgress = false;
  http.end();
  
  Serial.println("Update successfully installed!");
  return true;
}

/**
 * Verify MD5 hash of firmware
 * @param expectedMD5 Expected MD5 hash
 * @return true if matched, false otherwise
 */
bool verifyMD5(const char* expectedMD5) {
  if (!Update.isFinished()) {
    return false;
  }
  
  String calculatedMD5 = Update.md5String();
  calculatedMD5.toLowerCase();
  
  Serial.print("Expected MD5: ");
  Serial.println(expectedMD5);
  Serial.print("Calculated MD5: ");
  Serial.println(calculatedMD5.c_str());
  
  if (calculatedMD5.equals(expectedMD5)) {
    Serial.println("MD5 verification successful");
    return true;
  } else {
    Serial.println("MD5 verification failed");
    return false;
  }
} 