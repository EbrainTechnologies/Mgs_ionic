<?php 
require_once('cors.php'); 
$f=fopen('/var/www/html/testfile.txt','a');

$data = json_decode(file_get_contents("php://input"));
fwrite($f,print_r($data,1));

$code='pass';

require_once('cors.php'); 

$res=[];

if($code==$data)
{
$res=(object) ['message'=>'success','token'=>'asdasd3521321asdasd','pid'=>'2','responsecode'=>'1','username'=>'dinesh'];
echo json_encode($res);	
}
else{
	$res=(object) ['message'=>'failure','responsecode'=>'0'];
echo json_encode($res);
}





?>