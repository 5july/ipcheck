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
$.ajax({ type: "GET", async:false,
    url: "https://api.5july.net/1.0/ipcheck",
    success: function(result){

	    $('#isp').html('Du är uppkopplad med <b>' +result['ISP']+'</b> i <b>'+result['City']+'</b>');
	    //$('#city').text = result['city']

	    if(result['connected']){
	    	//$('#connectstatus').html('<h1 class="text-success"><i class="fas fa-shield-alt fa-3x"></i>&nbsp;Du är uppkopplad med Wireguard!</h1>');
	
		    ipv4=1;
		    $('#ipv4').text("Din ipv4 address är: "+result['ip']);
	    } else {
		    //$('#connectstatus').html('<h1 class="text-danger"><i class="fas fa-hand-paper fa-3x"></i>&nbsp;Du är inte uppkopplad med Wireguard!</h1>');


	    }
	    console.log(result['connected'])
            //$('#ip').text();

    }   
});
//}

/* get ipv6 address */
$.ajax({ type: "GET", async:false,
    url: "https://ipv6-only.api.5july.net/1.0/ipcheck",
    success: function(result){

            if(result['connected']){
		   ipv6=1;
                $('#ipv6').text("Din ipv6 address är: "+result['ip']);
            } else {
		    $('#ipv6').text("Kunde inte hitta någon ipv6 address!");
                    //$('#connectstatus').html('<h1 class="text-danger"><i class="fas fa-hand-paper fa-3x"></i>&nbsp;Du är inte uppkopplad med Wireguard!</h1>');


            }
            console.log(result['connected'])
            console.log(result);
	    //$('#ip').text();

    }
});

console.log(ipv4);
if (ipv4 == 1 && ipv6==1)
{
	$('#connectstatus').html('<h1 class="text-success"><i class="fas fa-shield-alt fa-3x"></i>&nbsp;Du är uppkopplad med VPN!</h1>');

} else {

	$('#connectstatus').html('<h1 class="text-danger"><i class="fas fa-hand-paper fa-3x"></i>&nbsp;Du är inte uppkopplad med VPN!</h1>')
}



if($("#ping").length != 0) {
var ping = new Date;
$.ajax({ type: "GET",
    url: "/?",
    cache:false,
    success: function(output){

        ping = new Date - ping;
	    $('#ping').text("Din ping är:"+ping+"ms");

    }
});
}
