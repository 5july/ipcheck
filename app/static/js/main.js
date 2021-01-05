$('#btn-create-user').click(function(){

	$.get('/ajax/newuser', function(data){
		$('#info').html(data);
	}).fail(function(e) {
    	//alert('woops'+ e); // or whatever
	});



});

//if($("#ip").length != 0) {
var ipv4=0;
var ipv6=0;
$.ajax({ type: "GET", async:true,
    url: "https://ipv4-only.api.5july.net/1.0/ipcheck",
        beforeSend: function() {
        $("#ipv4").html('<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>');
    },
	success: function(result){
		$('#ipv4').text("Din IPv4-address: "+result['ip'] + " ("+result['hostname']+")");

	    $('#isp').html('Din IP-adress tillhör <b>' +result['ISP']+'</b> i <b>'+result['City']+'</b>. (Integrity VPN använder IP-adresser från Bahnhof AB.)');
	    //$('#city').text = result['city']

	    if(result['blacklist'])
	    {
		    $('#ipv4-blacklist').html('<i class=\"fas fa-exclamation-triangle\"></i>Den här IP-adressen är svartlistad hos spamleverantörer. Detta kan påverka besök på olika hemsidor.')
	    } else {
		    $('#ipv4-blacklist').html('Din IP-address är inte svartlistad. Bra!')

	    }


	    if(result['connected']){
	    	//$('#connectstatus').html('<h1 class="text-success"><i class="fas fa-shield-alt fa-3x"></i>&nbsp;Du är uppkopplad med Wireguard!</h1>');

		    ipv4=1;
		    //$('#ipv4').text("Din IPv4-address: "+result['ip'] + " ("+result['hostname']+")");
	    } else {
		    //$('#connectstatus').html('<h1 class="text-danger"><i class="fas fa-hand-paper fa-3x"></i>&nbsp;Du är inte uppkopplad med Wireguard!</h1>');


	    }
            //$('#ip').text();

    },
	error: function(result)
                    {
                            $('#ipv4').html("<p class=\"alert-danger\"><i class=\"fas fa-exclamation-triangle\"> </li>Kunde inte hitta någon IPv4-address!</p>");
                    },
        timeout: 5000

});
//}

/* get ipv6 address */
$.ajax({ type: "GET", async:true,
    url: "https://ipv6-only.api.5july.net/1.0/ipcheck",
    beforeSend: function() {
        $("#ipv6").html('<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>');
    },
	success: function(result){
		$('#ipv6').text("Din IPv6-address: "+result['ip'] + " ("+result['hostname']+")");

            if(result['connected']){
		   ipv6=1;
                //$('#ipv6').text("Din IPv6-address: "+result['ip'] + " ("+result['hostname']+")");
            } else {
		    $('#ipv6').html("<p class=\"alert-danger\"><i class=\"fas fa-exclamation-triangle\"></li>Din IPv6 address tillhör inte IntegrityVPN det kan innebära att du läcker data trafik</p>");
                    //$('#connectstatus').html('<h1 class="text-danger"><i class="fas fa-hand-paper fa-3x"></i>&nbsp;Du är inte uppkopplad med Wireguard!</h1>');

	    }


    },
	error: function(result)
                    {
			    console.log("ipv6");
                            $('#ipv6').html("<p class=\"alert-danger\"><i class=\"fas fa-exclamation-triangle\"></li>Kunde inte hitta någon IPv6-address!</p>");
                    },
	timeout: 5000

            

});

console.log(ipv4);
function amiIntegrity()
{
if (ipv4 == 1 || ipv6==1)
{
	$('#connectstatus').html('<h2 class="text-success"><span class="fa-stack fa-lg fa-2x"><i class="fa fa-circle fa-stack-2x integrityyes"></i><i class="fa fa-thumbs-up fa-stack-1x fa-inverse fa-good"></i></span><br/><br/>Du är uppkopplad med Integrity VPN!</h2>');

} else {

	$('#connectstatus').html('<h2 class="text-danger"><span class="fa-stack fa-lg fa-2x"><i class="fa fa-circle fa-stack-2x integrityno"></i><i class="fa fa-thumbs-down fa-stack-1x fa-inverse fa-bad"></i></span><br/><br/>Du är inte uppkopplad med Integrity VPN!</h2>')
}
}
//amiIntegrity();

setInterval(amiIntegrity,2000); //lol


/*
setInterval(function(){
var ping = new Date;
$.ajax({ type: "GET",
    url: "/?",
    cache:false,
    success: function(output){

        ping = new Date - ping;
	    $('#ping').text("Din ping: "+ping+" ms");

    }
});
}, 1300);
*/
/*
 * for dnsleak
 *
 */
function makeid(length) {
   var result           = '';
   var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


domainname = makeid(16) + ".dnsleak.5july.net";

$.ajax({ type: "GET",
    url: "https://" + domainname,
    cache:false,
    error: function() {

	    $.ajax({ type: "GET",
    url: "/dnsleak/" + domainname,
    cache:false,
    success: function (result)
		    {
			    text = "<br>";
			    for(var i = 0; i < result["resolvers"].length; i++) {
    				var obj = result["resolvers"][i];
				    text += "nameserver: "+ obj.ip + " ISP "+ obj.isp + "<br> ";
			    }

			    $('#dnsleak').html('DNSleak test:' +text);

		    }



    });
    }
});


/*
 * for ipv6
 */


//domainname6 = makeid(16) + ".dnsleak6.5july.net";
text = "<br>"
var x;
/*
for(_x=0; _x<10; _x++)
{
	console.log("hej" + _x);
	domainname6 = makeid(16) + ".dnsleak6.5july.net";
	console.log("hej" + domainname6);
	x += await bajskorv(domainname6);
	//console.log(x);

	if ( _x == 9)
	{
		console.log(x)
	}
}*/



for(_x=0; _x<10; _x++)
{
        console.log("hej" + _x);
        domainname6 = makeid(16) + ".dnsleak6.5july.net";
        console.log("hej" + domainname6);
        bajskorv(domainname6);
        //console.log(x);

}

var text2 = "";
var list = []
function bajskorv(url)
{
    var servers = [];
    $.ajax({ type: "GET",
    url: "https://" + url,
    cache:true,
    error: function() {

            $.ajax({ type: "GET",
    url: "/dnsleak/" + url,
    cache:true,
    success: function (result)
                    {
                            //text = "<br>";
			    //var list = []
                            for(var i = 0; i < result["resolvers"].length; i++) {
                                var obj = result["resolvers"][i];
				    if(list.indexOf(obj.ip) != 0){
					    if (obj.iso != null) {
					    text2 += "nameserver: <span class=\"flag-icon flag-icon-"+obj.iso.toLowerCase()+ "\"></span>" +obj.ip+ " ISP "+ obj.isp + " ";
					    } else {
			    			text2 += "nameserver: "+ obj.ip + " ISP " + obj.isp + " ";
					    }

				    	if ( obj.leak == true )
				    {
					    text2 += '<i class="fas fa-skull-crossbones"></i>DNSleak: Ja';
				    } else {
					    text2 += '<i class="fas fa-thumbs-up"></i>DNSleak: Nej';
				    }
				    text2 += "<br>";

				    }
				    list.push(obj.ip)
                            }
			    //console.log(result);

                            $('#dnsleak6').html('DNSleak test:' +text2);

                    }



    });
    }
});
	return servers;
}
//}//for loop

