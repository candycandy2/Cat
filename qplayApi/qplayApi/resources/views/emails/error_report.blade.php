<h3>Error information:</h3>
<p><strong>Date:</strong> {{ date('M d, Y H:iA') }}</p>
<p><strong>Message:</strong> {{ $e->getMessage() }}</p>
<p><strong>Code:</strong> {{ $e->getCode() }}</p>
<p><strong>File:</strong> {{ $e->getFile() }}</p>
<p><strong>Line:</strong> {{ $e->getLine() }}</p>
<p><strong>Url:</strong> {{ $url }}</p>
<p><strong>Input:</strong> {{ $input }}</p>
<h3>Stack trace:</h3>
<pre>{{ $e->getTraceAsString() }}</pre>