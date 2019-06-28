browser.browserAction.onClicked.addListener(() => {

  browser.tabs.create({
    "url": "newtab.html"
  });

})


function getDomain(url){

let u = new URL(url);

url= u.hostname;

return url;
}

var tabSubresourceProtocolMap = new Map();

function getSubresourceMap(tabId) {
    /* fill table for subresources */	
  
  if (!tabSubresourceProtocolMap.has(tabId)) {
        tabSubresourceProtocolMap.set(tabId, new Map());
    }
    var subresourceMap = tabSubresourceProtocolMap.get(tabId);
    return subresourceMap;
}

async function processSecurityInfo(details) {

    try {
        var host = getDomain(details.url);

        let securityInfo = await browser.webRequest.getSecurityInfo(details.requestId,{});

        if (typeof securityInfo === "undefined") {
            return;
        }

        var subresourceMap = getSubresourceMap(details.tabId);
        subresourceMap.set(host, securityInfo);
        tabSubresourceProtocolMap.set(details.tabId, subresourceMap);


    let today = new Date().toLocaleDateString();
    let todayNumber = Number(new Date(today));


    let item = {
        host: host,
        protocolVersion: securityInfo.protocolVersion,
        cipherSuite: securityInfo.cipherSuite,
        keaGroupName: securityInfo.keaGroupName,
        certificates: securityInfo.certificates,
        certificateTransparencyStatus: securityInfo.certificateTransparencyStatus,
        signatureSchemeName: securityInfo.signatureSchemeName,
        hsts: securityInfo.hsts,
        hpkp: securityInfo.hpkp,
        isDomainMismatch: securityInfo.isDomainMismatch,
        isExtendedValidation: securityInfo.isExtendedValidation,   
        todayNumber: todayNumber,
        addedOn: Date.now(),
   };

    let getItems = JSON.parse(localStorage.getItem('tlsinfo')) || [];

    if (getItems.length === 0) {
      getItems.push(item)
    }

    let findindex = -1;

    const existingItem = getItems.find(function (values, index) {
      if (values.host == item.host) {
        values.protocolVersion = securityInfo.protocolVersion;
        values.cipherSuite= securityInfo.cipherSuite;
        values.keaGroupName = securityInfo.keaGroupName;
        values.certificates = securityInfo.certificates;
        values.certificateTransparencyStatus = securityInfo.certificateTransparencyStatus;
        values.signatureSchemeName = securityInfo.signatureSchemeName;
        values.hsts = securityInfo.hsts;
        values.hpkp = securityInfo.hpkp;
        values.isDomainMismatch = securityInfo.isDomainMismatch;
        values.isExtendedValidation = securityInfo.isExtendedValidation;
        values.todayNumber = todayNumber;
        findindex = index;
       
 return index;
       
      }
    });

    if (!existingItem && findindex == -1) {
      getItems.push(item);
    }

    let storeData = localStorage.setItem('tlsinfo', JSON.stringify(getItems));

    } catch(error) {
        console.error(error);
    }
}

function handleNavigation(details) {
    /* we are about to load a new page, delete old data */
    tabSubresourceProtocolMap.set(details.tabId, new Map());
}

browser.webRequest.onHeadersReceived.addListener(processSecurityInfo, {urls: ["https://*/*", "http://*/*"]}, ["blocking", "responseHeaders"] );

var filter = {  url: [{schemes: ["https", "http"]} ]};
browser.webNavigation.onBeforeNavigate.addListener(handleNavigation, filter);
