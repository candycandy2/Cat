


			QPlayWebServiceUrl = "https://qplaydev.benq.com/V101/qplay/sendPushMessage?lang=en-us&app_key=appportal&need_push=N"
			requestBody = "{
							    "message_title": "System Announcement",
								"message_type": "news",
							    "message_text": "http://www.myqisda.com/htmlfiles/...",
							    "message_html": "",
							    "message_url": "",
							    "template_id": "999",
							    "message_source": "Portal",
								"source_user_id": "QGROUP\MyQisda",
								"destination_user_id": {"user_id": "benq","user_id": "qisda"},
								"destination_role_id": {}
							}"

			Sub QPlayWebService()
					Set xmlhttp = server.CreateObject("Msxml2.XMLHTTP")
					xmlhttp.Open "POST",QPlayWebServiceUrl,false
					xmlhttp.setRequestHeader "Content-Type", "application/json"
					xmlhttp.setRequestHeader "App-Key", "appportal"
					xmlhttp.setRequestHeader "Signature-Time", DateDiff("s","01/01/1970 00:00:00",Now())
					xmlhttp.setRequestHeader "Signature", Base64( HMAC-SHA256( SignatureTime , 6437aabb44cbb954976296b16973270b ) )
					xmlhttp.Send(requestBody)
                    If xmlhttp.Status = 200 Then
                    Else
                    End if
			End Sub

