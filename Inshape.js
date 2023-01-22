// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;

/*
  Studios:
  
  In Shape Pure Plochingen //In Shape Dynamic Göppingen????? Wrong Link?
  In Shape Aalen
  In Shape Heidenheim
  In Shape Giengen
  In Shape Esslingen
  In Shape Geislingen
  In Shape Stauferpark //In Shape Premium Göppingen
  In Shape Süßen 
  In Shape Pure //In Shape Pure Göppingen
  In Shape Pure Plochingen
  InShape-Uhingen
  In Shape Waeschenbeuren
  In Shape Bad Boll
  
  Set it in the Parameter Setting in the Widget
*/


const studio = args.widgetParameter || 'In Shape Pure Plochingen';

if (config.runsInWidget) {
  const size = config.widgetFamily;
  const widget = await createWidget(size);

  Script.setWidget(widget);
  Script.complete();
} else {
  const size = 'small';
  const widget = await createWidget(size);
  if (size == 'small') {
    widget.presentSmall();
  } else if (size == 'medium') {
    widget.presentMedium();
  } else {
    widget.presentLarge();
  }
  Script.complete();
}

async function createWidget(size) {
  const auslastung = await fetchData(studio);

  if (auslastung === undefined) {
    const widget = new ListWidget();
    widget.addText('404 - Fitnessclub not found');
    return widget;
  }

  const widget = new ListWidget();
  widget.setPadding(8, 14, 14, 14);
  
  if (studio.includes("Pure")) {
    widget.backgroundColor = new Color('#ef7f1b');
  }else if (studio.includes("Dynamic")){// Not used by api
      widget.backgroundColor = new Color('#00858a');
  }else{// Premium
      widget.backgroundColor = new Color('#8f1635');
  }

  const contentStack = widget.addStack();
  contentStack.layoutVertically();

  // Studio Info
  const studioInfo = contentStack.addStack();
  studioInfo.layoutHorizontally();
  
  // Studio name
  const studioNameStack = studioInfo.addText(`${studio}`);
  studioNameStack.font = Font.boldRoundedSystemFont(30);
  studioNameStack.minimumScaleFactor = 0.4;
  studioNameStack.textColor = Color.white();
  studioInfo.addSpacer();
  
  // Studio Logo
  let shapeLogoImage = await new Request("https://scontent-muc2-1.xx.fbcdn.net/v/t31.18172-8/28423875_1730034353723382_9003724033576930331_o.jpg?_nc_cat=100&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=q_0gNMZHsqkAX-x5iHo&_nc_ht=scontent-muc2-1.xx&oh=00_AfBM2lQU0xnUPKi37f26qnbFtaMexz-pInBh2TS1R99yDA&oe=63F3DD55").loadImage()
  let imageStack = contentStack.addStack()
  imageStack.layoutHorizontally();
  imageStack.addSpacer();
  let imgstack = studioInfo.addImage(shapeLogoImage)
  imgstack.imageSize = new Size(40,40)
  contentStack.addSpacer();

  // Liveauslastung
  const liveausLastungTextStack = contentStack.addStack();
  liveausLastungTextStack.layoutHorizontally();

  const auslastungStr = liveausLastungTextStack.addText(`Liveauslastung:`);
  auslastungStr.font = Font.boldRoundedSystemFont(16);
  auslastungStr.textColor = Color.white();
  auslastungStr.centerAlignText()

  // Auslastung Prozent
  const auslastungStack = contentStack.addStack();
  auslastungStack.layoutHorizontally();
  auslastungStack.addSpacer();
  const auslastungText = auslastungStack.addText(`${auslastung}%`);
  auslastungStack.centerAlignContent();
  auslastungText.font = Font.boldRoundedSystemFont(30);
  auslastungText.textColor = Color.white();
  auslastungStack.addSpacer();
  
  contentStack.addSpacer();

  // Refresh Time
  const dateStack = contentStack.addStack();
  dateStack.addSpacer();
  dateStack.addSpacer();
  let dateT = new Date()
  let df = new DateFormatter()
  df.dateFormat = 'HH:mm'
  let dateString = df.string(dateT)
  const date = dateStack.addText(`🔄 ${dateString}`);
  date.font = Font.systemFont(10);
  date.textColor = Color.white();

  return widget;
}


// Get AuslastungData from API
async function fetchData(studio) {  

  let req = new Request("https://connect.e-app.eu:57319/easyWeb.svc/eApps/widgets");
  req.method = "POST"
  req.headers = {
        "Connection": " keep-alive",
        "Accept": " application/json, text/plain, */*",
        "Origin": " https://eLiveauslastung.e-app.eu",
        "Accept-Encoding": " gzip, deflate, br",
        "Accept-Language": " de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "text/plain"
   };
   req.body = JSON.stringify({
     call:"GeteLiveauslastung",
     param:{},
     useWS:0,
     studio:studio
  });

  let res = await req.loadJSON();
  const wert1 = res["Wert1"];
  // const wert2 = res["Wert2"];
  // log(JSON.stringify(res, null, 2));
  // log(wert1);
  return wert1;
}



