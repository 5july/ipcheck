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
	    console.log(result['connected'])
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

            console.log(result['connected'])
            console.log(result);
	    //$('#ip').text();
	console.log("ipvv");

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


//if($("#ping").length != 0) {
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
//}
