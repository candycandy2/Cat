<?php $error = unserialize($errorObj); ?>
<h3>Error information:</h3>
<p><strong>Date:</strong> {{ date('M d, Y H:iA') }}</p>
<p><strong>Message:</strong> {{ $error['message'] }}</p>
<p><strong>Code:</strong> {{ $error['code'] }}</p>
<p><strong>File:</strong> {{ $error['file'] }}</p>
<p><strong>Line:</strong> {{ $error['line'] }}</p>
<p><strong>Url:</strong> {{ $error['url'] }}</p>
<p><strong>Input:</strong> {{ $error['input'] }}</p>
<h3>Stack trace:</h3>
<pre>{{ $error['trace'] }}</pre>