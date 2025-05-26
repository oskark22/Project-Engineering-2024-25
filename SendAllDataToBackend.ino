// Dan Koskiranta
// 30 April 2025
// Collects GNSS satellite data and sends it as JSON to a server via Wi-Fi


#include <WiFi.h>                               //Allows ESP32 to connect to the internet
#include <HTTPClient.h>                         //Make HTTP GET, POST, PUT requests to a web server
#include <TinyGPS++.h>                          // Library decodes the NMEA sentences into useful GPS information
#include <HardwareSerial.h>                     //Allows you to use the UART.Read() function to collect serial data from a software serial port

#define rxPin 16       //GPIO16
#define txPin 17

const char* ssid = "Dan_s iPhone";
const char* password = "";
const char* serverURL = "http://172.20.10.2:8000/api/sendMessage";

HTTPClient http;
TinyGPSPlus gnss;
HardwareSerial gnssSerial(1);                   //Create an instance of HardwareSerial for UART1


void setup() {

  pinMode(16, INPUT);                           //RX pin receives data
  
  Serial.begin(9600);
  gnssSerial.begin(9600, SERIAL_8N1, rxPin, txPin);         //Initialize UART 1. SERIAL_8N1: format being sent over serial connection is 8 data bits, No parity bit, 1 stop bit

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  //Wait for WiFi connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());             //If you need, get the boards IP address*/

}

void loop() {
  // put your main code here, to run repeatedly:
  String sentence = "";
  String satelliteList = "[";                                                                     // JSON array to store satellites

  while (gnssSerial.available() > 0) {                                                            //Check if data is available
    char ch = gnssSerial.read();                                                                  //Read a character from the GNSS module
    Serial.write(ch);                                                                             //Output raw data to the serial monitor
    if (ch == '\n') {                                                                             //End of sentence. Full NMEA sentence is received
      if (sentence.startsWith("$GPGSV")) {
        String GPSsatelliteId = extractSatelliteID(sentence);                                     //Return a comma-separated string of satellite IDs
        if (GPSsatelliteId.length() > 0) {
          int firstIndex = 0, lastIndex = 0;                                                      // firstIndex: starting index of the current satellite ID. lastIndex: where the comma is found (ending index of satellite ID).
          while ((lastIndex = GPSsatelliteId.indexOf(",", firstIndex)) != -1) {                   //Search for first occurrence of "," starting from firstIndex. If character is not found, return -1
            String GPSid = GPSsatelliteId.substring(firstIndex, lastIndex);                       // Extract substring firstIndex to lastIndex. substring(start, end) includes the character at start, excludes character at end
            satelliteList += "{\"id\":\"" + GPSid + "\",\"type\":\"GPS\",\"country\":\"USA\"},";  // Format the satellite ID into JSON format  and add it to the satelliteList
            firstIndex = lastIndex + 1;                                                           // Move the firstIndex from the comma to the beginning of next ID  
          }
        }
      }
      else if (sentence.startsWith("$GLGSV")) {                                                    // GLONASS satellite info
        String GLONASSsatelliteId = extractSatelliteID(sentence);
        //Separate the satellite IDs
        if (GLONASSsatelliteId.length() > 0) {
          //Serial.println("Extracted IDs: " + GLONASSsatelliteId);
          int startIndex = 0, endIndex = 0;
          while ((endIndex = GLONASSsatelliteId.indexOf(",", startIndex)) != -1) {
            String GLONASSid = GLONASSsatelliteId.substring(startIndex, endIndex);
            satelliteList += "{\"id\":\"" + GLONASSid + "\",\"type\":\"GLONASS\",\"country\":\"Russia\"},";
            startIndex = endIndex + 1;
          }
        }
      }
      sentence = "";                                                                         //Reset the sentence to collect next NMEA sentence
    }
    else {
      sentence += ch;                                                                        //Add character to sentence
    }
  }
  if (satelliteList.length() > 1) {                                                          // 1 is the opening bracket [, length is 1. > 1 = length is over 1. If satellites were added (meaning [ is not alone)
    satelliteList.remove(satelliteList.length() - 1);                                        //Remove the last comma to keep the JSON valid
    satelliteList += "]";                                                                    // Close the array
    //Serial.println(satelliteList);
    sendSatellitesToServer(satelliteList);
  }
  delay(5000);
}

String extractSatelliteID(String nmeaSentence) {
  int commas = 0;
  bool getID = false;
  String satelliteIDs = "";
  bool firstSatelliteID = true;


  for (int i = 0; i < nmeaSentence.length(); i++) {                                         // Loop through each character of the NMEA sentence one by one using an index i
    char character = nmeaSentence[i];

    if (character == ',') {
      commas++;

      //Satellite IDs start at the 4th comma and repeat every 4 commas. If commas is 4, 4>=4 is true, 4-4 = 0, 0%4 = 0 is true, if statement will execute. 8-4 = 4 % 4 = 0. 12-5 = 7 % 4 = 3 (Not an ID)
      if (commas >= 4 && (commas - 4) % 4 == 0) {
        getID = true;
      }
      else {
        getID = false;
      }
    }
    else if (getID) {
      //Extract satellite ID
      int startIndex = i;
      int endIndex = nmeaSentence.indexOf(",", startIndex);         // Find the next comma after startIndex. It will give the end position for the satellite ID
      if (endIndex == -1) {                                         //No more commas left. -1 is returned by indexOf() when the character you're searching for is not found
        endIndex = nmeaSentence.length();                           //Set the index length to the total sentence length. Set endIndex to the end of the string so we can extract the final ID
      }
      String satID = nmeaSentence.substring(startIndex, endIndex);  // Extract the substring between startIndex and endIndex. This substring is the satellite ID.
      
      //if NMEA sentence is corrupted.
      if(satID.length() > 3) {
        break;
      }
      
      //Ignore IDs with '*'
      if (satID.indexOf('*') != -1) {
        break;
      }

      if (satID.length() > 0) {
        if (!firstSatelliteID) {                                    //If it's not the first satellite PRN, place a comma
          satelliteIDs += ",";                                      //Add comma before new satellite ID
        }
        satelliteIDs += satID;                                      //Add ID to the satelliteIDs string
        firstSatelliteID = false;
      }
      i = endIndex - 1;                                             //Adjust index to the last character of the extracted satellite ID,so the next iteration starts from the correct position.
    }
  }
  return satelliteIDs;
}



void sendSatellitesToServer(const String& satelliteList) {              // sendSatellitesToServer is a function that takes a constant reference to a String (satelliteList) as an argument.
  if (WiFi.status() == WL_CONNECTED) {
    http.begin(serverURL);                                              // Prepare for the HTTP request and take the URL as an argument
    http.addHeader("Content-Type", "application/json");                 // This adds an HTTP header specifying the type of content that is being sent in the request. Data will be in JSON format.

    String payLoad = "{\"satellites\":" + satelliteList + "}";
    int httpStatusCode = http.POST(payLoad);

    if (httpStatusCode > 0) {
      Serial.println("Data sent: " + String(httpStatusCode));
    }
    else {
      Serial.println("Error sending data: " + String(httpStatusCode));
    }
    http.end();                                                         // Close the HTTP connection
  }
  else {
    Serial.println("WiFi not connected");
  }
}
