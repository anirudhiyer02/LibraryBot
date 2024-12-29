from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time
import sys
from datetime import datetime, timedelta
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException, ElementClickInterceptedException

def handle_duo_push(driver):
    wait = WebDriverWait(driver, 10)  # Adjust timeout as needed
    try:
        wait.until(EC.frame_to_be_available_and_switch_to_it((By.XPATH,"//iframe[@id='duo_iframe']")))
        wait.until(EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Send Me a Push']"))).click()
        driver.switch_to.default_content()
    except TimeoutException:
        print("Timeout: 'Send Me a Push' button did not become clickable.")
        driver.save_screenshot("debug_screenshot_updated.png")
        print("Screenshot saved as debug_screenshot_updated.png.")

    except Exception as e:
        print(f"Error during Duo Push: {e}")

        
def login_to_ucsb(driver, email, password):
    wait = WebDriverWait(driver, 10)
    username = email.split('@')[0]
    try:
        # Wait for the login page to load by checking for the email field
        username_field = wait.until(EC.visibility_of_element_located((By.ID, "username")))  # Update with actual ID
        username_field.send_keys(username)

        # Wait for the password field and input the password
        password_field = wait.until(EC.visibility_of_element_located((By.ID, "password")))  # Update with actual ID
        password_field.send_keys(password)
        time.sleep(1)
        # Click the login button
        login_button = wait.until(EC.element_to_be_clickable((By.NAME, "submit")))  # Update with actual ID
        login_button.click()
        # print("Logged in successfully.")
        time.sleep(5)
        handle_duo_push(driver)
        # Optional: Wait to observe the result
        time.sleep(5)

    except Exception as e:
        print(f"Error during login: {e}")

def generate_time_end(date, time_slot, duration_hours=1):
    # Parse the date and time_slot into a datetime object
    datetime_str = f"{date} {time_slot}"
    start_time = datetime.strptime(datetime_str, "%Y-%m-%d %I:%M%p")

    # Add the duration to get the end time
    end_time = start_time + timedelta(hours=duration_hours)

    # Format the end time with capitalized day and month
    time_end = end_time.strftime("%I:%M%p %A, %B %d, %Y")
    time_end = time_end.replace("AM", "am").replace("PM", "pm")

    return time_end
def book_room(url, category, date, time_slot, time_end, email, password, room_name):
    try:
        # Initialize the web driver
        driver = webdriver.Chrome()
        driver.get(url)
        
        # Wait for the page to load
        wait = WebDriverWait(driver, 5)
        
        # Select Location (UCSB Library)
        # Assuming location is pre-selected and doesn't need interaction
        
        # Select Category from the dropdown menu
        category_dropdown = wait.until(EC.element_to_be_clickable((By.ID, "gid")))
        Select(category_dropdown).select_by_visible_text(category)
        
        # Click on the "Go to Date" field to open the calendar
        go_to_date_button = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "fc-goToDate-button")))
        go_to_date_button.click()

        time.sleep(1)
        # Select the desired date in the calendar
        day = date.split("-")[2]  # Extract the day part from the date (e.g., "2024-12-16" -> "16")
        #Need to cover navigating different month functionality
        # Locate the date cell in the table and click it
        date_xpath = f"//td[contains(@class, 'day') and not(contains(@class, 'disabled')) and text()='{day}']"

        # Wait for the date element to be clickable and click it
        date_cell = wait.until(EC.element_to_be_clickable((By.XPATH, date_xpath)))
        date_cell.click()
        print(f"Selected date: {date}")
        
        # Wait for the table to load the available time slots
        time.sleep(2)


        # Select the desired time slot by clicking the green square
        #time_slot_xpath = f"//a[contains(@title, '{time_slot} {datetime.strptime(date, '%Y-%m-%d').strftime('%A, %B %d, %Y')}') and contains(@class, 's-lc-eq-avail')]"
        room_name = "1506"  # Example room number

        # XPath to match the desired room and time slot
        time_slot_xpath = (
            f"//a[contains(@title, '{time_slot} {datetime.strptime(date, '%Y-%m-%d').strftime('%A, %B %d, %Y')}') and "
            f"contains(@title, 'Room {room_name}') and contains(@class, 's-lc-eq-avail')]"
)
        # Wait for the time slot element to be clickable and click it
        time_slot_element = wait.until(EC.element_to_be_clickable((By.XPATH, time_slot_xpath)))
        time_slot_element.click()
        print(f"Selected available time slot: {time_slot}")




        # Optional: Select additional times using the dropdown below the table
        # (This part depends on the exact implementation on the website)
        time.sleep(2)

        # Select the desired end time from the dropdown
        end_time_dropdown = wait.until(EC.element_to_be_clickable((By.ID, "bookingend_1")))
        # options = end_time_dropdown.find_elements(By.TAG_NAME, "option")
        # print("Available options in dropdown:")
        # for option in options:
        #     print(f"'{option.text}'")
        select = Select(end_time_dropdown)
        select.select_by_visible_text(time_end)
        time.sleep(1)
        # Click the "Submit Times" button
        submit_button = wait.until(EC.element_to_be_clickable((By.ID, "submit_times")))
        submit_button.click()
        time.sleep(5)
        login_to_ucsb(driver, email,password)
        time.sleep(5)
        continue_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@id='terms_accept']")))
        continue_button.click()

        username = email.split('@')[0]
        username_field = wait.until(EC.element_to_be_clickable((By.ID, "fname")))  # Update with actual ID
        username_field.send_keys(username)

        time.sleep(1)
        # submit_button = wait.until(EC.element_to_be_clickable((By.ID, "btn-form-submit")))
        # submit_button.click()
        print("Booking completed successfully.")
        time.sleep(15)  # Wait to observe the result before closing the browser

        # Close the browser
        driver.quit()

    except Exception as e:
        print(f"Error: {e}")
        driver.quit()

# Example usage
email = sys.argv[1]
password= sys.argv[2]
url = "https://libcal.library.ucsb.edu/reserve/24hour"
category = "Presentation Practice Room"  # Change to desired category
date = "2024-12-21"              # Date format should match the website's format
time_slot = "10:00am"    
time_end = generate_time_end(date, time_slot, 2)        # Change to the desired time slot
book_room(url, category, date, time_slot, time_end, email, password, "1506")

#Bot needs to be able to schedule bookings for dates outside the bookable window, and check if there are any 
#bookings in the window given a time and date
#Each day, bot should check if there are any schedulings on the queue that are in the bookable window. 
