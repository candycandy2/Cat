<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<title>QPlay API</title>

	<link href="{{ asset('/css/themes/default/jquery.mobile-1.4.5.min.css') }}" rel="stylesheet">
	<link href="{{ asset('/css/QLoading.css') }}" rel="stylesheet">
	<script src="{{ asset('/js/jquery-1.12.3.min.js') }}"></script>
	<script src="{{ asset('/js/jquery.mobile-1.4.5.min.js') }}"></script>
	<script src="{{ asset('/js/jquery.json.js') }}"></script>
	<script src="{{ asset('/js/Math.uuid.js') }}"></script>
	<script src="{{ asset('/js/core-min.js') }}"></script>
	<script src="{{ asset('/js/hmac-sha256.js') }}"></script>
	<script src="{{ asset('/js/enc-base64-min.js') }}"></script>
	<script src="{{ asset('/js/QLoading.js') }}"></script>
	<script>
		$(function () {
			$("body").removeClass('page-body');
        });
	</script>
	<style>
		body {
			font-family: "Gill Sans MT",Arial;
		}
		.page-body {
			display: none;
		}
	</style>
</head>
<body class="page-body">
	@yield('content')
</body>
</html>
