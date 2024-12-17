from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
#import chromedriver_autoinstaller
# def book_room(username, password, room_details):
#     driver = webdriver.Chrome()
#     driver.get("UCSB_LIBRARY_BOOKING_URL")

#     # Login
#     driver.find_element(By.ID, "username").send_keys(username)
#     driver.find_element(By.ID, "password").send_keys(password + Keys.RETURN)

#     # Automate the booking process
#     # (Add logic based on the website's structure)

#     driver.quit()

# # Example usage
# book_room("your_username", "your_password", {"room": "Room 101"})
# Initialize the web driver (ensure `chromedriver` is in your PATH)
#chromedriver_autoinstaller.install()

driver = webdriver.Chrome()

    # Launch the UCSB Library Room Booking Website
driver.get("https://libcal.library.ucsb.edu/reserve/24hour")

    # Wait for a few seconds to keep the browser open
time.sleep(3)

    # Close the browser
driver.quit()