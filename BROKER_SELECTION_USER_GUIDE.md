# Strategy में Broker Selection Feature - User Guide
# स्ट्रैटेजी में ब्रोकर सिलेक्शन फीचर - यूज़र गाइड

## Overview / अवलोकन

अब आप अपनी हर स्ट्रैटेजी के लिए एक या एक से ज्यादा ब्रोकर सिलेक्ट कर सकते हैं।  
Now you can select one or multiple brokers for each of your strategies.

## Features / विशेषताएं

1. **Multiple Brokers / कई ब्रोकर**: एक स्ट्रैटेजी में कई ब्रोकर जोड़ सकते हैं
2. **Easy Selection / आसान चयन**: Checkbox से सिंपल सिलेक्शन
3. **Visual Interface / विज़ुअल इंटरफ़ेस**: ब्रोकर की पूरी जानकारी देख सकते हैं
4. **Quick Update / त्वरित अपडेट**: एक क्लिक में सभी ब्रोकर अपडेट करें

## How to Use / कैसे उपयोग करें

### Step 1: Strategy Info Page पर जाएं
1. Dashboard से **"Strategy Info"** मेनू पर क्लिक करें
2. या directly `/user/strategy` URL पर जाएं

### Step 2: Broker Selection Button
1. "My Strategies" या "Subscribed Strategies" टैब में जाएं
2. जिस स्ट्रैटेजी में ब्रोकर add करना है उसे ढूंढें
3. **Action column** में **बैंक आइकन** (🏦) बटन देखें
4. इस बटन पर क्लिक करें

### Step 3: Broker Select करें
Dialog खुलेगा जिसमें:
1. आपके सभी **Active API Keys/Brokers** की list होगी
2. हर ब्रोकर के सामने checkbox होगा
3. ब्रोकर की जानकारी दिखेगी:
   - Broker Name (जैसे Zerodha, Angel One)
   - API Name (आपका दिया हुआ नाम)
   - Segment (Indian/Crypto/Forex)
   - Broker ID

### Step 4: Selection करें
1. जितने ब्रोकर चाहिए उतने **checkbox tick** करें
2. पहले से selected ब्रोकर में ✅ निशान दिखेगा
3. **"Select All"** बटन से सभी select कर सकते हैं
4. **"Deselect All"** से सभी unselect कर सकते हैं

### Step 5: Save Changes
1. Selection के बाद **"Save Changes"** बटन पर क्लिक करें
2. Success message दिखेगा: "Brokers updated successfully"
3. Dialog अपने आप बंद हो जाएगा

## Important Points / महत्वपूर्ण बातें

### ✅ Allowed / अनुमति है
- एक स्ट्रैटेजी में **multiple brokers** add कर सकते हैं
- किसी भी time ब्रोकर बदल सकते हैं
- Subscribed strategies में भी अपने ब्रोकर add कर सकते हैं

### ⚠️ Requirements / आवश्यकताएं
- ब्रोकर add करने से पहले **API Key add** करना जरूरी है
- केवल **Active API Keys** ही दिखेंगे
- Inactive या Pending keys नहीं दिखेंगे

### 📝 Note / नोट
- बिना changes किए Save button **disable** रहेगा
- Dialog save करने के दौरान **दूसरा operation** नहीं कर सकते
- Cancel button से बिना save किए close हो जाएगा

## Use Cases / उपयोग के मामले

### Case 1: Single Broker
अगर आप एक ही ब्रोकर use करते हैं तो उसे select करें।

### Case 2: Multiple Brokers for Backup
- Primary broker के साथ backup broker भी add करें
- अगर एक fail हो तो दूसरा काम करेगा

### Case 3: Different Brokers for Different Segments
- Indian market के लिए Zerodha
- Crypto के लिए Binance
- Forex के लिए OANDA

### Case 4: Testing Different Brokers
- Multiple brokers add करके test कर सकते हैं
- बाद में best performing को रख सकते हैं

## Troubleshooting / समस्या समाधान

### Problem: Broker button नहीं दिख रहा
**Solution**: 
- Refresh page करें
- Check करें कि आप owner हैं strategy के

### Problem: No brokers दिख रहे dialog में
**Solution**:
- पहले API Key add करें
- Check करें कि API Key Active है

### Problem: Save button disabled है
**Solution**:
- कुछ changes करें (broker select/deselect)
- या Cancel करके फिर से खोलें

### Problem: Save करने पर error
**Solution**:
- Internet connection check करें
- API Key valid है check करें
- Page refresh करके फिर try करें

## Visual Guide / विज़ुअल गाइड

```
Strategy Info Page
├── My Strategies Tab
│   └── Strategy Row
│       └── Action Buttons:
│           ├── 👁️ View
│           ├── ⏸️ Pause
│           ├── ✏️ Edit
│           ├── 🗑️ Delete
│           ├── 🏦 Select Brokers ← यह नया बटन
│           └── 📊 Trade Mode
│
└── Subscribed Strategies Tab
    └── Strategy Row
        └── Action Buttons:
            ├── 👁️ View
            ├── ⏸️ Pause
            ├── 🗑️ Unsubscribe
            ├── 🏦 Select Brokers ← यह नया बटन
            └── 📊 Trade Mode
```

## Example / उदाहरण

**Scenario**: आपके पास 2 API Keys हैं - Zerodha और Angel One

1. Strategy Info page खोलें
2. "NIFTY Scalping" strategy की row में
3. 🏦 (Bank) icon पर क्लिक करें
4. Dialog में दोनों brokers दिखेंगे:
   ```
   ☐ Zerodha Main Account
      Zerodha | Indian | ID: ABC123
   
   ☐ Angel One Backup
      Angel One | Indian | ID: XYZ789
   ```
5. दोनों को tick करें
6. "Save Changes" क्लिक करें
7. Done! अब दोनों brokers इस strategy में जुड़ गए

## Benefits / फायदे

1. **Flexibility**: अलग-अलग strategies के लिए अलग brokers
2. **Redundancy**: Backup broker से reliability बढ़ती है
3. **Testing**: Multiple brokers compare कर सकते हैं
4. **Optimization**: Best performing broker चुन सकते हैं
5. **Easy Management**: Simple UI से manage करना easy

## Next Steps / अगले कदम

1. पहले API Keys add करें (यदि नहीं किया है)
2. Strategy बनाएं या existing strategy चुनें
3. Broker selection feature use करें
4. Strategy run करें और performance देखें

## Support / सहायता

अगर कोई problem आए तो:
1. Documentation फिर से पढ़ें
2. Admin से contact करें
3. Support ticket raise करें

---

**Last Updated**: December 16, 2025
**Version**: 1.0
