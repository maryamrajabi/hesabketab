//------------- tables-ajax.js -------------//
var mostSeller;
$(document).ready(function() {

	//------------- Sparklines in header stats -------------//
	$('#spark-visitors').sparkline([5,8,10,8,7,12,11,6,13,8,5,8,10,11,7,12,11,6,13,8], {
		type: 'bar',
		width: '100%',
		height: '20px',
		barColor: '#dfe2e7',
		zeroAxis: false,
	});

	$('#spark-templateviews').sparkline([12,11,6,13,8,5,8,10,12,11,6,13,8,5,8,10,12,11,6,13,8,5,8], {
		type: 'bar',
		width: '100%',
		height: '20px',
		barColor: '#dfe2e7',
		zeroAxis: false,
	});

	$('#spark-sales').sparkline([19,18,20,17,20,18,22,24,23,19,18,20,17,20,18,22,24,23,19,18,20,17], {
		type: 'bar',
		width: '100%',
		height: '20px',
		barColor: '#dfe2e7',
		zeroAxis: false,
	});

	//------------- Ajax table deferred load -------------//
	
        /*table-mostSeller*/
         mostSeller = $('#table-mostSeller2').DataTable( {
            "paging": true,
            "scrollCollapse": true,
            "fixedColumns": true,
            "searchable": true,
            "columnDefs": [ {
            "orderable": false,
            "targets": [0,1,2,3,4,5,6,7,8,9,10]
        }],
        /*"order": [[ 4, 'asc' ]],*/
        "ajax": "includes/hesabketab/ajax/objects_2.txt",
		"columns": [
                        { "data": null },
			{ "data": "kalaCode" },
			{ "data": "bookName" },
			{ "data": "chap" },
			{ "data": "writer" },
			{ "data": "nasher" },
			{ "data": "number" , "defaultContent": '<input type="number" min="1" value="1" class="form-control mw80" name="quantity" placeholder="تعداد">'},
                        { "data": "gheimat" },
			{ "data": "takhfif" },
			{ "data": "jam" },
                        { "data": function (data, type, row, meta) {
                            return '<a class="badge badge-danger badge-icon icon-delete"><i class="fa fa-times-circle"></i></a>\n\
                                    <a class="badge badge-success badge-icon icon-gift"><i class="fa fa-gift"></i></a>';
                            } 
                        }
		],
		"oLanguage": {
		    "sSearch": "",
		    "sLengthMenu": "<span>_MENU_</span>"
		},
		"sDom": "T<'row'<'col-md-6 col-xs-12 'l><'col-md-6 col-xs-12'f>r>t<'row'<'col-md-4 col-xs-12'i><'col-md-8 col-xs-12'p>>"
            });
            mostSeller.on( 'order.dt search.dt', function () {
                mostSeller.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                    cell.innerHTML = i+1;
                });
            }).draw();
          
    /*sum of tedade forosh*/
    setTimeout(arrayoftabledata,200);
    
    /*change number every book*/
    $("#table-mostSeller2").on('change',"input[type='number']",function(e){
        arrayoftabledata ();
    });

    /*Delete row*/
    $('#table-mostSeller2 tbody').on( 'click', '.icon-delete', function () {
        mostSeller
            .row($(this).parents('tr'))
            .remove()
            .draw();
        arrayoftabledata();
    });
    /*add onvan in popup*/
    $('.selectpicker').on('change', function(){
        var selected = $(this).find("option:selected").text();
        if(selected==='+ افزودن'){
            $('#OnvanModal').modal();
            $('#Onvan').val('');
        }
    });

    $('#addOnvan').click(function (){
        var onvan=$('#Onvan').val();
        $(".selectpicker").append('<option value="'+onvan+'" selected="">'+onvan+'</option>');
      $(".selectpicker").selectpicker("refresh");
    });
});

/*sabte barcode*/  
$('.sabteBarcodeWithCheck').click(function (){   
    var kalaCode;
    var foundRow='';
    var getBarcode=$('#barcodeInput').val();
     var currentPage = mostSeller.page();
    mostSeller.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var tableData = this.data(); 
        kalaCode=tableData.kalaCode;
        if(getBarcode===kalaCode){
            foundRow=kalaCode;
        }
    });
    if(foundRow !== ''){
        // Find indexes of rows which have `Yes` in the second column
        var indexes = mostSeller.rows().eq(0).filter( function (rowIdx) {
        return mostSeller.cell( rowIdx, 1 ).data() === foundRow ? true : false;

    } );
    // Add a class to those rows using an index selector
    mostSeller.rows().nodes().to$().removeClass('highlight');
    mostSeller.rows(indexes).nodes().to$().addClass('highlight');

    var inputVal=mostSeller.cell(indexes,6).nodes().to$().find('input').val();
    inputVal=parseInt(inputVal)+1;
    mostSeller.cell(indexes,6).nodes().to$().find('input').val(inputVal);
    mostSeller.page(currentPage).draw();
    arrayoftabledata();
    }
    else if(getBarcode === ''){
         $('#barcodeInput').parent().find('span').text(' بارکد را وارد کنید');
    }
    else{
        $('#barcodeInput').parent().find('span').text('');
         mostSeller.rows().nodes().to$().removeClass('highlight');
            mostSeller.row.add( {
            "kalaCode":       "9789644701787",
            "bookName":   "جدید",
            "chap":     "2",
            "writer": "نویسنده",
            "nasher":     "ناشر",
            "gheimat":       "20000",
            "takhfif":       "10",
            "jam":       "125"
        }).draw(false).nodes().to$().addClass('highlight');
    mostSeller.order([0, 'asc']).draw();
    mostSeller.page('last').draw(false);
    }
    $('#barcodeInput').val('').focus();
});

function arrayoftabledata (){
    var dd={};
    var counter=0;
    /*sum all books price*/
    var sumGheimatbooks=0;
    var SumdiscountValue=0;
    var sumGhbooks=0;
    var sumPricebooks=0;
    mostSeller.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        counter++;
    });
        
    /*sum number all books*/
    var myData=mostSeller.$('input').serializeArray();
        var sumVal=0;
        for(var i=0;i<myData.length;i++){
        dd[i] =parseInt(myData[i]['value']);
        sumVal+=dd[i];
        $('#SumTedad').text(sumVal);
    }
    for(i=0;i<counter;i++){
        var inputValue=parseInt(mostSeller.cell(i,6).nodes().to$().find('input').val());
        var GheimatValue=parseInt(mostSeller.cell(i,7).nodes().to$().text());
        var discountValue=parseInt(mostSeller.cell(i,8).nodes().to$().text());
        var sumPrice=inputValue*GheimatValue;
        sumPricebooks+=sumPrice;
        var jamValue=inputValue*(GheimatValue-(GheimatValue*discountValue/100));
        mostSeller.cell(i,9).nodes().to$().text(jamValue);
        sumGheimatbooks+=jamValue;
        sumGhbooks+=GheimatValue;
    }
    SumdiscountValue=sumPricebooks-sumGheimatbooks;
    $('.sumPricebooks').text(sumGheimatbooks.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    $('#sumGheimatbooks').text(sumPricebooks.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    $('.discountText').text(SumdiscountValue.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
}
/*payType*/
$('#creditCard').on('change', function(){
    $(this).closest('div').find('.radioCustom').prop("checked", true);
});
/*creditCardInput*/

$('#gheirenaghdi').keyup(function(e) { 
    var buyPrice=$('#buyPrice').cleanVal();
      var thisVal=$(this).cleanVal();
      if(thisVal===''){
          $('#naghdi').val('');
          finalPrice='';
      }
      else if (parseInt(thisVal)>=parseInt(buyPrice)) {
          if($('#gheirenaghdi').hasClass('maxOfnaghdi')){
              
          }
          else{
            $('#gheirenaghdi').addClass('maxOfnaghdi');
            $('#gheirenaghdi.maxOfnaghdi').closest('.form-group').find('> span').text('مبلغ وارد شده بیشتر از مبلغ کل میباشد');
            $('#naghdi').val('0');
          }
    }
      else{
          var finalPrice=parseInt(buyPrice)-parseInt(thisVal);
            finalPrice=finalPrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            $('#naghdi').val(finalPrice);
            $('#gheirenaghdi.maxOfnaghdi').closest('.form-group').find('> span').text('');
            $('#gheirenaghdi').removeClass('maxOfnaghdi');
      }
    $('.spanNaghdi').text(finalPrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    $('.spanGheirenaghdi').text(thisVal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
});
$('#naghdi').keyup(function(e) { // text written
      var buyPrice=$('#buyPrice').cleanVal();
      var thisVal=$(this).cleanVal();
      if(thisVal===''){
          $('#gheirenaghdi').val('');
          finalPrice='';
      }
      else if (parseInt(thisVal)>=parseInt(buyPrice)) {
          if($('#naghdi').hasClass('maxOfnaghdi')){
              
          }
          else{
            $('#naghdi').addClass('maxOfnaghdi');
            $('#naghdi.maxOfnaghdi').closest('.form-group').find('> span').text('مبلغ وارد شده بیشتر از مبلغ کل میباشد');
            $('#gheirenaghdi').val('0');
          }
    }

      else{
          var finalPrice=parseInt(buyPrice)-parseInt(thisVal);
            finalPrice=finalPrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            $('#gheirenaghdi').val(finalPrice);
            $('#naghdi.maxOfnaghdi').closest('.form-group').find('> span').text('');
            $('#naghdi').removeClass('maxOfnaghdi');
            
      }
    $('.spanNaghdi').text(thisVal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    $('.spanGheirenaghdi').text(finalPrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
});
$('#receiveCustomer').keyup(function(e) { // text written
      var buyPrice=$('.buyPrice').cleanVal();
      var thisVal=$(this).cleanVal();
      if(parseInt(thisVal)<=parseInt(buyPrice)){
          $('#backCustomer').val('0');
      }
     else if (thisVal===''){
         $('#backCustomer').val('');
     }
     else{
        var finalPrice=parseInt(thisVal)-parseInt(buyPrice);
        finalPrice=finalPrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        $('#backCustomer').val(finalPrice);
     }
});

/**/
 $('.sabt').click(function() {
    var dargah=$("input:radio[name='dargah']:checked").val();
    $('.spanDargah').text(dargah);
  });
$('.payType div label').click(function (){
    $('.payType div p').hide();
});
$('.payType div .lastLable').click(function (){
    $('.payType div p').show();
});

function customNewValid() {
  var validateThis = $(".modalNghForm").validate({              
    rules: {
        naghdi: {
            required: true,
        },
        gheirenaghdi: {
            required: true,
        },
        dargah: {
          required: true,
        }
      },
    messages: {
        naghdi: {
            required: "لطفا مبلغ را مشخص کنید",
        },
        gheirenaghdi: {
            required: "لطفا مبلغ غیرنقدی را مشخص کنید",
        },
        dargah:{
            required: "درگاه بانک را انتخاب کنید"
        }                 
    }
  }).form();
    if(validateThis==true){
       var qqq = $(".modalNghForm").closest('.modal');
           $(qqq).modal('hide');
    }else{
      $(".modalNghForm").validate();
    }
};
