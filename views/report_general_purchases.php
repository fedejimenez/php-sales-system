<?php
   require_once("../config/connection.php");
   if(isset($_SESSION["id_user"])){
    require_once("../models/Purchase.php");
    
    $purchases=new Purchase();
    $data= $purchases->get_purchases_report_general();
    $data_year= $purchases->sum_purchases_total_year();
?>

<?php require_once("header.php");?>

  <!-- check if user has permission -->
  <?php
    if ($_SESSION["purchases_reports"] == 1) {

  ?>

  <div class="content-wrapper">
    <h2 class="report_purchases_general container-fluid bg-red text-white col-lg-12 text-center mh-50">
        PURCHASES REPORT - MONTH / YEAR
    </h2>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="btn-group text-center">
          <button type='button' id="buttonExport" class="btn btn-primary btn-lg" ><i class="fa fa-print" aria-hidden="true"></i>Print
          </button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
        <div class="box">
          <div class="">
            <h2 class="report_purchases_general container-fluid bg-red text-white col-lg-12 text-center mh-50">REPORT - GENERAL PURCHASES</h2>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>YEAR</th>
                    <th>N° MONTH</th>
                    <th>NAME MONTH</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                <?php
                  for($i=0;$i<count($data);$i++){
                    $months = array("January","February","March","April","May","June","July","August","September","October","November","December");
                    $date= $data[$i]["month"];
                    $date_month = $months[date("n", strtotime($date))-1];
                    ?>
                    <tr>
                      <td><?php echo $data[$i]["year"]?></td>
                      <td><?php echo $data[$i]["number_month"]?></td>
                      <td><?php echo $date_month?></td>
                      <td><?php echo $data[$i]["currency"]." ".$data[$i]["total_purchase"]?></td>
                    </tr>
                    <?php
                  }//end for
              ?>
            </tbody>
          </table>
       </div><!--end box-body-->
      </div><!--end box-->
    </div><!--end col-xs-12-->
    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
      <div class="box">
        <div class="">
          <h2 class="report_purchases_general container-fluid bg-primary text-white col-lg-12 text-center mh-50">PERCENTAGE PER YEAR
          </h2>
          <table class="table table-bordered">
            <thead>
              <th>YEAR</th>
              <th>TOTAL</th>
              <th>PERCENTAGE %</th>
            </thead>
            <tbody>
              <?php
                $arrayReg = array();
              ?>
              <?php 
                for($i=0; $i<count($data_year); $i++){
                 array_push($arrayReg, array(
                    'year' => $data_year[$i]["year"],
                    'total_purchase_year' => $data_year[$i]["total_purchase_year"],
                    'currency' => $data_year[$i]["currency"]
                    )
                  );
                }//end for
                
                $sumTotal = 0;
                for($j=0;$j<count($arrayReg);$j++){
                  $sumTotal = $sumTotal + $data_year[$j]["total_purchase_year"];
                }
                
                $percentage_total=0;
                for($i=0;$i<count($arrayReg);$i++) {
                  $data_per_year=$arrayReg[$i]["total_purchase_year"];
                  $percentage_per_year= round(($data_per_year/$sumTotal)*100,2);  
                  $percentage_total= $percentage_total+ $percentage_per_year;
                      ?>
                  <tr>
                    <td><?php echo $arrayReg[$i]["year"];?></td>
                    <td><?php echo $arrayReg[$i]["currency"]." ".$arrayReg[$i]["total_purchase_year"];?>
                    </td>
                    <td><?php echo $percentage_per_year?></td>
                   </tr>
                   <?php 
                } 
              ?>
              <tr>
                <td><strong>Total:</strong>  </td>
                <td><strong> <?php echo $arrayReg[0]["currency"]." ".$sumTotal?> </strong></td>
                <td> <strong> <?php echo $percentage_total?> </strong></td>
              </tr>
            </tbody>
          </table>
        </div><!--end box-body-->
      </div><!--end box-->
    </div><!--end col-xs-6-->
  </div><!--end row-->

  <!--second row-->
  <div class="row">
    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
      <div class="box">
        <div class="">
          <h2 class="report_purchases_general container-fluid bg-red text-white col-lg-12 text-center mh-50">REPORT - GENERAL PURCHASES BY YEAR
          </h2>
          <div id="container" style="min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto"></div>
          </div><!--end box-body-->
        </div><!--end box-->
      </div><!--end col-lg-6-->

      <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
        <div class="box">
          <div class="">
            <h2 class="report_purchases_general container-fluid bg-primary text-white col-lg-12 text-center mh-50">REPORT - CANCELED PURCHASES BY YEAR
            </h2>
            <div id="container_canceled" style="min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto">
            </div>
          </div><!--end box-body-->
        </div><!--end box-->
      </div><!--end col-lg-6-->
    </div><!--end row-->
  </div>
  <!-- /.content-wrapper -->

  <!-- if user has no permission -->
  <?php 
    } else {
      require("noaccess.php");
    }
  ?>  
  
  <?php require_once("footer.php");?>
  
  <script type="text/javascript">
    $(document).ready(function() {
      var chart = new Highcharts.Chart({
        chart: {
          renderTo: 'container', 
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        exporting: {
        url: 'http://export.highcharts.com/',
        enabled: false
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
              showInLegend:true,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',

                         fontSize: '20px'
                    }
                }
            }
        },
        legend: {
            symbolWidth: 12,
            symbolHeight: 18,
            padding: 0,
            margin: 15,
            symbolPadding: 5,
            itemDistance: 40,
            itemStyle: { "fontSize": "17px", "fontWeight": "normal" }
        },
        series: [{
          name: 'Total',
          colorByPoint: true,
          data: [
          <?php echo $data_graph= $purchases->sum_purchases_total_graph();?>
          ]
        }], 
        exporting: {
          enabled: false
        }
      });


    // canceled purchases
    var chart = new Highcharts.Chart({
      //$('#container').highcharts({
      chart: {
        
          renderTo: 'container_canceled', 
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },

          exporting: {
          url: 'http://export.highcharts.com/',
          enabled: false

            },

      title: {
          text: ''
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
            showInLegend:true,
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                  style: {
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',

                       fontSize: '20px'
                  }
              }
          }
      },
      legend: {
          symbolWidth: 12,
          symbolHeight: 18,
          padding: 0,
          margin: 15,
          symbolPadding: 5,
          itemDistance: 40,
          itemStyle: { "fontSize": "17px", "fontWeight": "normal" }
      },
      series: [
                {
        name: 'Canceled',
        colorByPoint: true,
        data: [
          <?php echo $data_graph= $purchases->sum_purchases_canceled_total_graph();?>
          ]
          }], 
          exporting: {
                enabled: false
          }
      });

      $('#buttonExport').click(function() {
          printHTML()
          document.addEventListener("DOMContentLoaded", function(event) {
         printHTML(); 
      });
    }); 
  });

  function printHTML() { 
    if (window.print) { 
      window.print();
    }
  }
</script>

<?php
   } else {
      header("Location:".Connect::route()."index.php");
   }
?>