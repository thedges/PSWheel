# PSWheel
THIS SOFTWARE IS COVERED BY [THIS DISCLAIMER](https://raw.githubusercontent.com/thedges/Disclaimer/master/disclaimer.txt).

This package contains a Lightning component for creating a wheel to show dependent items related to the current record. For example, the wheel could be used to show related benefit programs a contact is eligible for and which ones they are currently enrolled, or perhaps a list of licenses they need to acquire. The example below shows a sample list of benefit programs (ex: child support, cash assistance, etc...). Ones they are enrolled in are in blue while others in grey are which ones they are eligible for. The component can be placed on any object type and the list of items around the wheel are fully configurable.

![alt text](https://github.com/thedges/PSWheel/blob/master/PSWheel.png "PSWheel")

# Configuration

The wheel is controlled by creating a PSWheelTemplate record and then configuring PSWheelItemDef child records. The PSWheelTemplate record primary creates a "template name" so that you can reference that configuration when you configure the wheel component on a record page. 

## PSWheelTemplate
Here are the configuration options for PSWheelTemplate:

| Parameter  | Definition |
| ------------- | ------------- |
| Template Name  | A unique name for the wheel template. You will reference this when configuration the wheel component on record page  |
| Child Object API Name  | The object API name of the child record to query for 'wheel items'  |
| Child Parent Field  | The field API name on child object that references the parent object you are placing the wheel component on  |
| Child Match Field  | The field API name on child object to get the value to match against the 'Match Value' in the PSWheelItemDef records. This is used to match the custom object in the demo (program, license, etc...) to the PSWheelItemDef record that defines the wheel item. Typically you would create a picklist on your custom object and reference that field API name here. |
| Child Filter Clause  | [Optional] A extra SOQL where clause to filter out child records to eliminate them from matching in the wheel. For example, you could have a clause like 'Status__c = 'active''  |
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

# Setup Instructions
Here are steps to setup and configure this component:
  * Install the component per the "Deploy to Salesforce" button below. 
  * Assign the PSWheel permission set to any user that will use the PSWheel component.
  * Navigate to the PSWheelTemplate tab
    - Create a PSWheelTemplate record and provide unique name. Fill out the record field options per above definitions.
    - Create 1-to-many PSWheelItemDef records to define configuration of all the nodes of the wheel. Fill out the record field options per above definitions.
  * Edit the record page for the object you want to place the wheel component on. Drag the PSWheelAura component to area on the page. In the configuration options for the component, pick the template name you defined above.
  * That is it.

<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>
