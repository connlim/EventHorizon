from lib2to3.pgen2 import driver
import time
from selenium import webdriver
from webdriver_manager.firefox import GeckoDriverManager

# geolocation API not supported
geoDisabled = webdriver.FirefoxOptions()
geoDisabled.set_preference("geo.enabled", False)

# geolocation supported but denied
geoBlocked = webdriver.FirefoxOptions()
geoBlocked.set_preference("geo.prompt.testing", True)
geoBlocked.set_preference("geo.prompt.testing.allow", False)

# geolocation supported, allowed and location mocked
geoAllowed = webdriver.FirefoxOptions()
geoAllowed.set_preference('geo.prompt.testing', True)
geoAllowed.set_preference('geo.prompt.testing.allow', True)
geoAllowed.set_preference('geo.provider.network.url',
    'data:application/json,{"location": {"lat": 51.47, "lng": 0.0}, "accuracy": 100.0}')

geoOptions = [geoDisabled, geoBlocked, geoAllowed]

for opt in geoOptions:
    driver = webdriver.Firefox(executable_path=GeckoDriverManager().install(), options=opt)
    driver.get("https://eventhorizon.vercel.app/")
    # driver.get("http://localhost:3000")
    print('driver Title:',driver.title)
    print('Driver name:',driver.name)
    print('Driver URL:',driver.current_url)
    time.sleep(5)
    driver.quit()