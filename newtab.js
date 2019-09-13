var items = JSON.parse(localStorage.getItem('tlsinfo')) || [];

items.forEach((item, index) => {
  
	console.log(JSON.stringify(item)+" "+index);

  if (item.protocolVersion === undefined) {
	
	
   $('tbody').append('<tr><td>' + index + '</td> <td>' + item.host + '</td> <td>' + "undefined" + '</td> <td>' + "undefined" + '</td> <td>' + "undefined" + '</td> <td>' + "undefined" + '</td><td>' + "undefined"    +' </td><td>' + "undefined" + '</td> <td>' + "undefined" + '</td> <td>' + "undefined" + '</td> <td>' +"undefined" + '</td> <td>' + "undefined" + '</td> <td>' + "undefined"+ '</td> </tr>');

  }
	
 else
{

  hsts = item.hsts ? 'Yes' : 'No';
  hpkp = item.hpkp ? 'Yes' : 'No';
  mismatch = item.isDomainMismatch ? 'Yes' : 'No';
  ev = item.isExtendedValidation ? 'Yes' : 'No';

  $('tbody').append('<tr><td>' + index + '</td> <td>' + item.host + '</td> <td>' + item.protocolVersion + '</td> <td>' + item.cipherSuite + '</td> <td>' + item.keaGroupName + '</td> <td>' + item.certificates[item.certificates.length - 1].issuer + '</td><td>' + new Date(item.certificates[item.certificates.length - 1].validity.start).toLocaleDateString() + ' - ' + new Date(item.certificates[item.certificates.length - 1].validity.end).toLocaleDateString() + ' </td> <td>' + item.signatureSchemeName + '</td><td>' + item.certificateTransparencyStatus + '</td> <td>' + hsts + '</td> <td>' + hpkp + '</td> <td>' + mismatch + '</td> <td>' + ev + '</td> </tr>');

}
  
});


