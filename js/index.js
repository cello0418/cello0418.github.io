function load_css(_id){
    let head = document.getElementsByTagName("head")
    let style = document.createElement("link")
    style.type = "text/css"
    style.rel = "stylesheet"
    if(_id === "AMWCASIATDAC"){
        $('head').append(`<link rel="stylesheet" href="css/amwcasiatac.css">`)
    }else if(_id === "MMTP2022"){
        $('head').append(`<link rel="stylesheet" href="css/mmtp2022.css">`)
    }else if(_id=='AMWCASIA2023'){
        $('head').append(`<link rel="stylesheet" href="css/amwcasia2023.css">`)
    }

}



function background(index){
    var images = {
        "AMWC Asia TDAC 2022-Speaker":"2022TDACappreciaation.jpg",
        "AMWC Asia TDAC 2022-Attendance":"2022TDACAttendance.jpg",
        "Merz-MMTP2022-Attendance": "MMTP2022Attendance.jpg",
        "Merz-MMTP2022-Attendance814": "MMTP2022Attendance814.jpg",
        "Merz-MMTP2022-Speaker": "MMTP2022Appreciation.jpg",
        "AMWC-Asia-2023-participants": "AMWCAsia2023-Certificate.jpg",
        "AMWCAsia2023-Certificate-Speaker":"AMWCAsia2023-Certificate-Speaker.jpg"
    }
    return images[index]
}

function load_data(index){
    var data = {"AMWCASIATDAC": {"data": "AMWCAsiaTDAC2022.json", "name": "皮膚科春季會 AMWC Asia-TDAC 2022", "dep": "皮膚科學會", "date": "2022/05/08", "start": "皮膚科學會會員"},
                "MMTP2022": {"data": "Merz-MMTP2022.json", "name": "MMTP - Radiesse", "dep": "Merz Taiwan","start": "MMTP 會員"},
                "AMWCASIA2023":{"data":"AMWCAsia2023.json", "name": "AMWCAsia 2023", "dep":"AMWCA", "date": "2023/05/05","AMWCAsia": "AMWCAsia member"}
            }
    return data[index]
}

function close_window(){
    $("#verify_window, #data_windows").removeClass("is-visible");
}


function queryString()
{
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++)
    {
        var pair = vars[i].split("=");
        if(pair.length <= 1 ){
            return undefined;
        }
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined")
        {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string")
        {
            var arr = [query_string[pair[0]], pair[1]];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else
        {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
}

var data_windows_is_open = false;
function windows_function(){
    if(data_windows_is_open === false){
        $("#data_windows").addClass("is-visible");
        data_windows_is_open = true;
    }else{
        $("#data_windows").removeClass("is-visible");
        data_windows_is_open = false;
    }
}

$( document ).ready(function() {

    if(queryString() !== undefined){
        var hashcode = queryString()['hashcode'];
        var object_id = queryString()['id'];

        var hidden = queryString()['hidden']
        if(hidden){
            $("#under_data").css("visibility", "hidden")
        }

        load_css(object_id)

        if(hashcode !== undefined && object_id !== undefined && load_data(object_id) !== undefined){
            var conf_data = load_data(object_id);
            fetch(`../json/${conf_data['data']}`)
                .then( res => {
                    return res.json();
                })
                .then( res => {
                    if( res[hashcode] !== undefined ){

                        $('#licence').css('background-image', 'url(./img/' +  background( res[hashcode]['type'] )+ ')');
                        $("#licence_button").hover(function (){
                            $(this).css('cursor', 'pointer')
                        })
                        setTimeout(  function(){ $("#block_start").hide() }, 3000 );
                        setTimeout(  function(){ $("#block_start_i").show() }, 3000 );

                        setTimeout(  function(){ $("#second_ul").show() }, 3300 );
                        setTimeout(  function(){ $("#block_mid").hide() }, 5000 );
                        setTimeout(  function(){ $("#block_mid_i").show() }, 5000 );

                        setTimeout(  function(){ $("#third_ul").show() }, 5000 );
                        setTimeout(  function(){ $("#block_end").hide() }, 7000 );
                        setTimeout(  function(){ $("#block_end_i").show() }, 7000 );

                        $("#block").html(hashcode);
                        setTimeout(  function(){ $("#start").html(conf_data['start'])}, 7100 );
                        setTimeout(  function(){ $("#name").html(res[hashcode]['name'])}, 7100 );
                        setTimeout(  function(){ $("#end").html("已驗證")}, 7100 );

                        setTimeout(  function(){ $("#li_name").html(conf_data['name'])}, 7100 );
                        setTimeout(  function(){ $("#li_dep").html(conf_data['dep'])}, 7100 );
                        let date = undefined
                        if(conf_data['date'] === undefined){
                            date = res[hashcode]['verify_date']
                        }else{
                            date = conf_data['date']
                        }

                        setTimeout(  function(){ $("#li_date").html(  date  )}, 7100 );

                        new QRCode(document.getElementById("qrcode"),
                            {
                                text: `https://www.mycertification.co/?id=${object_id}&hashcode=${hashcode}`,
                                width: 40,
                                height: 40
                            }
                        );
                    }else{
                        setInterval(  function(){ $("#content").html("<ul>連接區塊鏈</ul><ul>驗證本人身份</ul><ul>已驗驗證非證書</ul>")}, 4500);
                        setInterval(  function(){ $("#name").html("驗證失敗")}, 3000 );
                    }
                })
                .catch(function(err) {
                    setInterval(  function(){ $("#content").html("<ul>無法連接區塊鏈</ul>") }, 3000);
                });
        }else{
            setInterval(  function(){ $("#content").html("<ul>沒有正確參數</ul>") }, 2000);
        }
    }
    else {
        setInterval(  function(){ $("#content").html("<ul>沒有參數</ul>")} , 2000 );
    }

    $('#click_new_window').click(function (){
        let url = window.location.href
        url = `${url}&hidden=true`
        window.open(url)
    })
});