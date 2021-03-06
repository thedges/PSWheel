# PSWheel
THIS SOFTWARE IS COVERED BY [THIS DISCLAIMER](https://raw.githubusercontent.com/thedges/Disclaimer/master/disclaimer.txt).

This package contains a Lightning component for creating a wheel to show dependent items related to the current record. For example, the wheel could be used to show related benefit programs a contact is eligible for and which ones they are currently enrolled, or perhaps a list of licenses they need to acquire. For the active items around the wheel, one can double-click on the item to take you to that record detail page.

The example below shows a sample list of benefit programs (ex: child support, cash assistance, etc...). Programs they are enrolled in are in blue while others in grey are programs they are not enrolled in but are eligible for. The component can be placed on any object type and the list of items around the wheel are fully configurable.

![alt text](https://github.com/thedges/PSWheel/blob/master/PSWheel.png "PSWheel")

# Dependency

This uses the Vis.js Network javascript library found [here](https://visjs.org/). Originally I wanted to use Lightning Web Component but locker service doesn't like this library so I had to fall back to Aura component and set API at version 39 to disable locker service. Have plans to make a version of the component based on [D3.js](https://d3js.org/) but while D3.js is very powerful, will take some time to learn.

# Configuration

The wheel is controlled by creating a __PSWheelTemplate__ record and then configuring __PSWheelItemDef__ child records. The PSWheelTemplate record primarily defines a "template name" so that you can reference that configuration when you configure the wheel component on a record page. 

## PSWheelTemplate
Here are the configuration options for PSWheelTemplate:

| Parameter  | Definition |
| ------------- | ------------- |
| Template Name  | A unique name for the wheel template. You will reference this when configuration the wheel component on record page  |
| Child Object API Name  | The object API name of the child record to query for 'wheel items'  |
| Child Parent Field  | The field API name on child object that references the parent object you are placing the wheel component on  |
| Child Label Field  | [Optional] The field API name on child object to use as the label for that node/circle on the wheel  |
| Child Match Field  | The field API name on child object to get the value to match against the 'Match Value' in the PSWheelItemDef records. This is used to match the custom object in the demo (program, license, etc...) to the PSWheelItemDef record that defines the wheel item. Typically you would create a picklist on your custom object and reference that field API name here. |
| Child Filter Clause  | [Optional] A extra SOQL where clause to filter out child records to eliminate them from matching in the wheel. For example, you could have a clause like __Status__c = 'active'__  |
| Center Label Field  | The field API name on main record to use as the label for the center image in the wheel |
| Center Image Default  | A default image URL to show in the center of wheel if image is not configured or null for current record  |
| Center Image Field  | [Optional] The field API name of main record to use to get image to place in center of wheel |

And here is a sample configuration for a PSWheelTemplate:

![alt text](https://github.com/thedges/PSWheel/blob/master/PSWheelTemplate.png "PSWheelTemplate")

## PSWheelItemDef

Within a PSWheelTemplate record, you need to create 1-to-many PSWheelItemDef child records to define all the nodes on the outside of the wheel. Here are the configuration options for PSWheelTemplate:

| Parameter  | Definition |
| ------------- | ------------- |
| Name  | The name/label for the wheel item |
| Show Label  | Boolean to show or hide label on wheel |
| Active Image URL  | An image URL to show for wheel item tat does have matching record  |
| Inactive Image URL  | An image URL to show for wheel item that does not have matching record |
| Hover Text  | Some text to show when you hover over the wheel item |
| Match Value  | The value on child record to match it to this definition. It matches the value here to the child record value as defined in the PSWheelTemplate:Child Match Field as defined above |

And here is a sample configuration for a PSWheelItemDef:

![alt text](https://github.com/thedges/PSWheel/blob/master/PSWheelItemDef.png "PSWheelItemDef")


# Wheel Images

For the wheel images, it is best to create square images with a little padding around the core symbol as the images will be cropped to circles in the wheel component. Create one image for your active image with a bolder background color and then create a sibling for the inactive image with same image pattern in same exact x/y location but change background to more subdued color. Here is example of two images (300px by 300px):

![alt text](https://github.com/thedges/PSWheel/blob/master/PSWheelImageExample.png "PSWheelImageExample")

Next zip up all your images in a zip file and load them in your Salesforce org as a static resource. When creating the zip, I typically do not include the base folder in my zip to avoid having to specifiy that in my URL. Just zip the files directly to the zip file. Once uploaded as static resource, you can reference the image with URL like following (ex: static resource is named 'ProgramIcons'):

/resource/ProgramIcons/FoodAssistance_Active.png
/resource/ProgramIcons/FoodAssistance_Inactive.png

Please refer to the __WheelImageSamples.zip__ file in the GitHub repo for examples. If you create new images for your wheel, please share back to me to add to the samples.

# Setup Instructions
Here are steps to setup and configure this component:
  * Install the component per the __Deploy to Salesforce__ button below. 
  * Assign the __PSWheel__ permission set to any user that will use the PSWheel component.
  * Navigate to the __PSWheelTemplate__ tab
    - Create a __PSWheelTemplate__ record and provide unique name. Fill out the record field options per above definitions.
    - Create 1-to-many __PSWheelItemDef__ records to define configuration of all the nodes of the wheel. Fill out the record field options per above definitions.
  * Edit the record page for the object you want to place the wheel component on. Drag the __PSWheelAura__ component to area on the page. In the configuration options for the component, pick the template name you defined above.
  * That is it.

<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>
