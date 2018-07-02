<h3>QPlay User Employee No. Duplicate:</h3>
<p>syncUserJob found duplidate emp_no, please check:</p>
<table style="font-size:13px;padding:10px;border-collapse: collapse;border: 1px solid gray">
<tbody>
<tr>
@foreach ($columns as $column)
    <td style="background-color: #f2f2f2;border: 1px solid gray"><span style="font-weight:bold;">{{$column}}</span></td>
@endforeach
</tr>
@foreach ($users as $user)
    <tr>
    @foreach ($user as $key => $value)
        @if($key == 'updated_at' || $key =='created_at' || $key =='deleted_at')
            <td style="border: 1px solid gray"> {{ ($value == '-0001-11-30 00:00:00') ? '0000-00-00 00:00:00' : $value }}</td>
        @else
            <td style="border: 1px solid gray">{{$value}}</td>
        @endif
    @endforeach
    </tr>
@endforeach
</tbody>
</table>