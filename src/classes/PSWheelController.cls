public without sharing class PSWheelController {

    @AuraEnabled
	public static String getWheelConfig(String recordId, String templateName)
	{
        try
		{
           return getWheelData(recordId, templateName);
        }
        catch(Exception e)
		{
			throw new  AuraHandledException(e.getTypeName() + ' - ' + e.getMessage());
		}
    }
    
    // String str = PSWheelController.getWheelData('0034600000gg95kAAA', 'Program Benefits');
    // System.debug('str=' + str);
    public static String getWheelData(String recordId, String templateName)
    {
        Map<String, Object> resp = new Map<String, Object>();

        ////////////////////////////////////
        // get object name of main record //
        ////////////////////////////////////
        String sObjName = Id.valueOf(recordId).getSObjectType().getDescribe().getName();
        resp.put('objectName', sObjName);

        ////////////////////////////////
        // get template configuration //
        ////////////////////////////////
        PSWheelTemplate__c temp = [SELECT Child_Object_API_Name__c, Child_Parent_Field__c, Child_Match_Field__c,
                                          Center_Image_Field__c, Child_Filter_Clause__c, Center_Label_Field__c, Center_Image_Default__c,
                                          (SELECT Name__c, Show_Label__c, Active_Image_URL__c, Inactive_Image_URL__c, Match_Value__c, Hover_Text__c FROM PSWheelItemDef__r ORDER BY Name__c ASC)
                                          FROM PSWheelTemplate__c
                                          WHERE Template_Name__c = :templateName];
        System.debug('temp=' + JSON.serialize(temp));
        if (temp != null)
        {
            String soql;

            resp.put('centerImage', null);
            resp.put('centerLabel', null);

            if (temp.Center_Image_Field__c == null && sObjName == 'Contact')
            {
                Contact con = [SELECT PhotoURL FROM Contact WHERE Id = :recordId];
                resp.put('centerImage', con.PhotoURL);
            }

            if (temp.Center_Image_Field__c == null && temp.Center_Label_Field__c != null)
            {
                soql = 'SELECT ' + temp.Center_Label_Field__c + ' FROM ' + sObjName + ' WHERE Id = \'' + recordId + '\'';
                SObject mainRec = Database.query(soql);
                if (mainRec != null)
                {
                    resp.put('centerLabel', mainRec.get(temp.Center_Label_Field__c));
                }
            }
            else if (temp.Center_Image_Field__c != null && temp.Center_Label_Field__c != null)
            {
                soql = 'SELECT ' + temp.Center_Image_Field__c + ', ' + temp.Center_Label_Field__c + ' FROM ' + sObjName + ' WHERE Id = \'' + recordId + '\'';
                SObject mainRec = Database.query(soql);
                if (mainRec != null)
                {
                    resp.put('centerImage', mainRec.get(temp.Center_Image_Field__c));
                    resp.put('centerLabel', mainRec.get(temp.Center_Label_Field__c));
                }
            }

            if (resp.get('centerImage') == null && temp.Center_Image_Default__c != null)
            {
              resp.put('centerImage', temp.Center_Image_Default__c);
            }


            ////////////////////////////
            // get wheel item details //
            ////////////////////////////
            soql = 'SELECT Id, ' + temp.Child_Match_Field__c +
                   ' FROM ' + temp.Child_Object_API_Name__c +
                   ' WHERE ' + temp.Child_Parent_Field__c + '=\'' + recordId + '\'';
            if (temp.Child_Filter_Clause__c != null)
            {
                soql += ' AND ' + temp.Child_Filter_Clause__c;
            }
            List<SObject> recItemList = Database.query(soql);
            Map<String, Id> matchValueMap = new Map<String, Id>();
            for (SObject item : recItemList)
            {
                matchValueMap.put((String)item.get(temp.Child_Match_Field__c), item.Id);
            }
            System.debug(JSON.serializePretty(matchValueMap));

            List<Map<String, Object>> itemList = new List<Map<String, Object>>();
            for (PSWheelItemDef__c itemDef : temp.PSWheelItemDef__r)
            {
                Map<String, Object> itemDetail = new Map<String, Object>();
                //itemDetail.put('name', itemDef.Name__c);

                String image;
                if (matchValueMap.containsKey(itemDef.Match_Value__c))
                {
                    itemDetail.put('image', itemDef.Active_Image_URL__c);
                    itemDetail.put('status', 'active');
                    itemDetail.put('recordId', matchValueMap.get(itemDef.Match_Value__c));
                }
                else {
                    itemDetail.put('image', itemDef.Inactive_Image_URL__c);
                    itemDetail.put('status', 'inactive');
                    itemDetail.put('recordId', null);
                }

                itemDetail.put('label', itemDef.Name__c);
                itemDetail.put('showLabel', itemDef.Show_Label__c);
                itemDetail.put('hoverText', itemDef.Hover_Text__c);

                itemList.add(itemDetail);
            }
            resp.put('items', itemList);
        }

        return JSON.serializePretty(resp);
    }
}