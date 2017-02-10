<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>QMessage</title>

	<script src="{{ asset('/js/lib/jquery-1.12.3.min.js') }}"></script>
<!--<script src="{{ asset('/js/lib/jquery.mobile-1.4.5.min.js') }}"></script>-->
	<script src="{{ asset('/js/lib/md5.min.js') }}"></script>
	<script src="{{ asset('/js/lib/emoji.js') }}"></script>
	<script src="{{ asset('/js/lib/jmessage-sdk-web-2.1.0.min.js') }}"></script>
	<!--<script src="{{ asset('/js/lib/jmessage-sdk-web.js') }}"></script>-->
	<link rel="stylesheet" href="{{ asset('/styles/jquery.mobile-1.4.5.min.css') }}"/>
	<script type=text/javascript>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
	</script>
</head>
<body>
	@yield('content')
</body>
</html>
