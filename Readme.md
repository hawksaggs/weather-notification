Create an application which notifies
the registered user of the temperature change for the given range. For example, if a user A wants to be notified for changes beyond the range 10 to 40 degree Celsius for a city, the notification should be triggered when the current temperature goes out of this
range. Also, the notification should happen when the temperature comes back to normal range. 

Example:

User is registered to receive
notification for temperature change for 10-45 for Noida.

1. Current temperature 35 ->
No notification

2. Current temperature 42 ->
No notification

3. Current temperature 45 ->
No notification

4. Current temperature 48 ->
Notification should be sent to the user that the temperature has crossed 45

5. Current temperature 46 ->
No notification

6. Current temperature  39 ->
Notification should be sent to the user telling that the temperature has come back to the user range

7. Current temperature   9 ->
Notification should be sent to the user as the temperature be below 10

8. Current temperature  8 ->
No notification as it was already outside the user provided range

9. Current temperature  11 ->
Notification should be sent telling the user that it has come back to the range.


To find the current temperature,
you can use free api provided by openweathermap.org. Please make sure you comply with their free usage terms. Don't make more than
1 api call every 10 minutes for one city.

Also, to notify the user you
can use the api call equivalent of the following:

curl 'https://reqres.in/api/notifyUser/1'
 -H 'Content-Type: application/json' --data-binary '{"current_temperature": 40}'


Steps to run the project:

1. Make sure you have nodejs and mysql installed on your system.

2. Make sure you run the seed.sql file in MYSQL

3. Create .env file in the backend folder and put 
    MYSQL_HOST = localhost
    MYSQL_PORT = 3306
    MYSQL_USERNAME = root
    MYSQL_PASSWORD = password
    MYSQL_DATABASE = join
    EMAIL_USERNAME = your gmail username
    EMAIL_PASSWORD = your gmail password
    OPEN_WEATHER_API_KEY = c60b8dc6a148e0abb6c10115a9d8c10f

4. Go to root folder of project.

5. Type npm install

6.  Type npm start to start the server.

7. Open http://localhost:3000