from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time
from datetime import datetime, timedelta
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
def book_room(url, category, date, time_slot, time_end):
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

        # Locate the date cell in the table and click it
        date_xpath = f"//td[contains(@class, 'day') and not(contains(@class, 'disabled')) and text()='{day}']"

        # Wait for the date element to be clickable and click it
        date_cell = wait.until(EC.element_to_be_clickable((By.XPATH, date_xpath)))
        date_cell.click()
        print(f"Selected date: {date}")
        
        # Wait for the table to load the available time slots
        time.sleep(2)
        
        # Select the desired time slot by clicking the green square
        time_slot_xpath = f"//a[contains(@title, '{time_slot} {datetime.strptime(date, '%Y-%m-%d').strftime('%A, %B %d, %Y')}') and contains(@class, 's-lc-eq-avail')]"

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
        # Click the "Submit Times" button
        # submit_button = wait.until(EC.element_to_be_clickable((By.ID, "submit_times_button")))
        # submit_button.click()
        
        print("Booking completed successfully.")
        time.sleep(15)  # Wait to observe the result before closing the browser

        # Close the browser
        driver.quit()

    except Exception as e:
        print(f"Error: {e}")
        driver.quit()

# Example usage
url = "https://libcal.library.ucsb.edu/reserve/24hour"
category = "Presentation Practice Room"  # Change to desired category
date = "2024-12-20"              # Date format should match the website's format
time_slot = "10:00am"    
time_end = generate_time_end(date, time_slot, 2)        # Change to the desired time slot
book_room(url, category, date, time_slot, time_end)
