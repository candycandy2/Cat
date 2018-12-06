<!--#include file="codepage/big5.asp"-->
<!--#include virtual="/connect/myQisda_SQLi03.asp"-->

<%
	secid = request("secid")
	tid = request("tid")
	cls = request("cls")

	sql = "select * from myBenQ_Talk_List_View where tid=" & tid
	set rsPortal = conn.execute(sql)
	
	'ADODB.Stream物件
	filePath = Server.MapPath("Layout_mail_2015_0623_v1_utf8.htm")
	Set STM=Server.CreateObject("ADODB.Stream")
	STM.Type = 2    '傳回資料的型態，1：Binary data ，2：Text data (預設值)
	STM.Charset = "utf-8"   '指定編碼
	STM.Open
	STM.LoadFromFile filePath
	tempHtml = ""
	tempHtml = STM.ReadText
	STM.Close
	Set STM = Nothing	
	
	if not rsPortal.eof then

		secid = rsPortal("secid")
		tid = rsPortal("tid")
		empno = trim(rsPortal("empno"))

		htmlDetail = tempHtml
		htmlDetail = Replace(htmlDetail, "###WebCode###", Session("WebCode"))
		htmlDetail = Replace(htmlDetail, "###Today###", Date())
		htmlDetail = Replace(htmlDetail, "###SecImage###", "")	
		
		'save html file
		if tid <> "" then
		
			sql = "select * from view_mybenq_talk_list where status=1 and tid=" & tid
			set rsNews = Server.CreateObject("ADODB.Recordset")
			rsNews.Open sql,conn,3,1			
			
			if not rsNews.eof then
			
				htmlSummary = ""
				htmlAttachedFiles = ""
	            
				FileName = rsNews("SiteID") & "-" & rsNews("SecID") & "-" & rsNews("TID") & ".htm" 
				htmlpath = Server.MapPath("/htmlFiles/" & FileName)	
				set stm=server.CreateObject("adodb.stream")
				stm.Type=2 
				stm.mode=3
				stm.charset="utf-8"
				stm.open
	
	            thisDetail = htmlDetail
	            
	            If Len(Trim(rsNews("Summary"))) > 0 Then
	                htmlSummary = "<p style='font-size: 10pt;'>"
	                If Len(Trim(rsNews("Summary_Image"))) > 0 Then
	                    Summary_Img = Left(Trim(rsNews("Summary_Image")), (Len(Trim(rsNews("Summary_Image"))) - 4)) & "_s" & Right(Trim(rsNews("Summary_Image")), 4)
	                    htmlSummary = htmlSummary & "<img name='oriImage' border='0' src='http://myqisda.qgroup.corp.com/images_Talk/" & Summary_Img & "' align='right'>"
	                End If
	                htmlSummary = htmlSummary & "<b>" & Replace(Trim(rsNews("Summary")), vbCrLf, "<br>") & "</b></p>"
	            End If
	                      
		        'html banner
	    	    Set rsBanner = conn.execute("select * from EPaper_Banner where status=1")
		        Set rsBannerCount = conn.execute("select count(*) as RCount from EPaper_Banner where status=1")
	        	BannerCount = rsBannerCount("RCount")
	    	    If BannerCount > 0 Then
		            ReDim arrBannerNo(BannerCount)
	            	ReDim arrBannerName(BannerCount)
	        	    pppp = 0
	    	        While Not rsBanner.EOF
		                pppp = pppp + 1
	                	arrBannerNo(pppp) = rsBanner("BannerNo")
	            	    arrBannerName(pppp) = rsBanner("ImageName")
	        	        rsBanner.MoveNext
	    	        Wend
		        End If            
	            
				'replace html banner
	            BannerNo = rsNews("BannerNo")
	            If IsNull(BannerNo) Or BannerNo = "" Then
	                BannerNo = 0
	            End If
	            For nnnn = 1 To BannerCount
	                If BannerNo = arrBannerNo(nnnn) Then
	                    BannerName = arrBannerName(nnnn)
	                End If
	            Next
	            
	            thisDetail = Replace(thisDetail, "##BannerName##", BannerName)
	            thisDetail = Replace(thisDetail, "###Today###", Date())
	            thisDetail = Replace(thisDetail, "###Subject###", Trim(rsNews("Subject")))
	            thisDetail = Replace(thisDetail, "###Author###", Trim(rsNews("NickName")))
	            thisDetail = Replace(thisDetail, "###PublishedDate###", FormatDateTime(rsNews("CreDate"),vbShortDate))
	            thisDetail = Replace(thisDetail, "###Content###", Replace(rsNews("Content"), vbCrLf, "<br>"))
	            thisDetail = Replace(thisDetail, "###Summary###", htmlSummary)
	            
	            If Trim(rsNews("ImageFile0")) <> "" Or Trim(rsNews("ImageFile1")) <> "" Or Trim(rsNews("ImageFile2")) <> "" Or Trim(rsNews("ImageFile3")) <> "" Or Trim(rsNews("ImageFile4")) <> "" Or Trim(rsNews("ImageFile5")) <> "" Then
	                htmlAttachedFiles = htmlAttachedFiles & "<p><img src='http://myqisda.qgroup.corp.com/Images/images.gif'><p>"
	                htmlAttachedFiles = htmlAttachedFiles & "<table border=0 width=100% cellspacing=0 cellpadding=0>"
	                htmlAttachedFiles = htmlAttachedFiles & "<tr>"
	                show_count = 0
	                For i = 0 To 5
	                    imageNam = "ImageFile" & i
	                    imageDesc = "ImageDesc" & i
	                    Desc = Trim(rsNews(imageDesc))
	                    If Desc = "" Then Desc = Trim(rsNews(imageNam))
	                    If Len(Trim(rsNews(imageNam))) > 0 Then
	                        show_count = show_count + 1
	                        Img_s = Left(Trim(rsNews(imageNam)), (Len(Trim(rsNews(imageNam))) - 4)) & "_s" & Right(Trim(rsNews(imageNam)), 4)
	                        htmlAttachedFiles = htmlAttachedFiles & "<td width=50% align='center' valign='top'>"
	                        htmlAttachedFiles = htmlAttachedFiles & "<table width='250' border='0' cellspacing='0' cellpadding='0'>"
	                        htmlAttachedFiles = htmlAttachedFiles & "<tr><td height='189' valign='top' background='http://myqisda.qgroup.corp.com/Images/Img_BG.gif'>"
	                        htmlAttachedFiles = htmlAttachedFiles & "<table width='240' border='0' cellspacing='1' cellpadding='0'>"
	                        htmlAttachedFiles = htmlAttachedFiles & "<tr><td height='180' align='center'><img border='0' name='oriImage'"
	                        htmlAttachedFiles = htmlAttachedFiles & " src='http://myqisda.qgroup.corp.com/Images_Talk/" & Img_s & "'"
	                        htmlAttachedFiles = htmlAttachedFiles & " onClick=" & Chr(34) & "showPics('http://myqisda.qgroup.corp.com/Art_PicShow.Asp?iNam="
	                        htmlAttachedFiles = htmlAttachedFiles & Replace(Trim(rsNews(imageNam)), "'", "\'")
	                        If Not IsNull(Desc) Then htmlAttachedFiles = htmlAttachedFiles & "&desc=" & Replace(Replace(Desc, vbCrLf, ""), "'", "\'") & "')"
	                        htmlAttachedFiles = htmlAttachedFiles & Chr(34) & " style='cursor: hand;'></td></tr></table></td></tr></table>"
	                        htmlAttachedFiles = htmlAttachedFiles & "<table width='260' border='0' cellspacing='0' cellpadding='0'>"
	                        htmlAttachedFiles = htmlAttachedFiles & "<tr><td height='24' onClick=" & Chr(34) & "showPics('http://myqisda.qgroup.corp.com/Art_PicShow.Asp?iNam="
	                        htmlAttachedFiles = htmlAttachedFiles & Replace(Trim(rsNews(imageNam)), "'", "\'")
	                        If Not IsNull(Desc) Then htmlAttachedFiles = htmlAttachedFiles & "&desc=" & Replace(Replace(Desc, vbCrLf, ""), "'", "\'") & "')"
	                        htmlAttachedFiles = htmlAttachedFiles & Chr(34) & " style='cursor: hand;'><a href='#'>&nbsp;" & Desc
	                        htmlAttachedFiles = htmlAttachedFiles & "</a></td></tr></table>"
	                        htmlAttachedFiles = htmlAttachedFiles & "&nbsp;<br></td>"
	                    End If
	                    If (show_count) Mod 2 = 0 Then htmlAttachedFiles = htmlAttachedFiles & "</tr><tr>"
	                Next
	                htmlAttachedFiles = htmlAttachedFiles & "</tr></table>"
	            End If
	        
	            ReDim txt_OtherFile(5)
	            ReDim txt_OtherDesc(5)
	            For z = 0 To 5 Step 1
	                txt_OtherFile(z) = Trim(rsNews("OtherFile" & z))
	                txt_OtherDesc(z) = Trim(rsNews("OtherDesc" & z))
	            Next
	            
	            If Len(txt_OtherFile(0)) > 0 Then
	                htmlAttachedFiles = htmlAttachedFiles & "<p><img src='http://myqisda.qgroup.corp.com/Images/txt.gif' width=120 height=39></p>"
	                For i = 0 To 5 Step 1
	                    If txt_OtherDesc(i) = "" Then txt_OtherDesc(i) = txt_OtherFile(i)
	                    If txt_OtherFile(i) <> "" Then
	                        htmlAttachedFiles = htmlAttachedFiles & "<table width=100% border=0 cellspacing=0 cellpadding=0>"
	                        htmlAttachedFiles = htmlAttachedFiles & "<tr><td width=40 height=28>&nbsp;</td>"
	                        htmlAttachedFiles = htmlAttachedFiles & "<td valign='middle'><a href='http://myqisda.qgroup.corp.com/Images_Talk/"
	                        htmlAttachedFiles = htmlAttachedFiles & txt_OtherFile(i) & "' target='_blank'><img src='http://myqisda.qgroup.corp.com/Images/Download_s.gif' border=0> "
	                        htmlAttachedFiles = htmlAttachedFiles & txt_OtherDesc(i) & "</a></td></tr></table>"
	                    End If
	                Next
	            End If
	            
	            If Len(Trim(rsNews("MediaFile0"))) > 0 Then
	                htmlAttachedFiles = htmlAttachedFiles & "<p><img src='http://myqisda.qgroup.corp.com/Images/media.gif' width=120 height=39></p>"
	                For i = 0 To 5 Step 1
	                    otherNam = "MediaFile" & i
	                    MediaDesc = "MediaDesc" & i
	                    Desc = Trim(rsNews(MediaDesc))
	                    If Desc = "" Then Desc = Trim(rsNews(otherNam))
	                    If Trim(rsNews(otherNam)) <> "" Then
	                        htmlAttachedFiles = htmlAttachedFiles & "<table width=100% border=0 cellspacing=0 cellpadding=0>"
	                        htmlAttachedFiles = htmlAttachedFiles & "<tr><td width=40 height=28>&nbsp;</td>"
	                        htmlAttachedFiles = htmlAttachedFiles & "<td valign='middle'><a href='http://myqisda.qgroup.corp.com/Images_Talk/"
	                        htmlAttachedFiles = htmlAttachedFiles & Trim(rsNews(otherNam)) & "' target='_blank'><img src='http://myqisda.qgroup.corp.com/Images/media_1.gif' border=0> "
	                        htmlAttachedFiles = htmlAttachedFiles & Desc & "</a></td></tr></table>"
	                    End If
	                Next
	            End If
	            
	            If Len(Trim(rsNews("MediaFile"))) > 0 Then
	                MediaFile = Trim(rsNews("MediaFile"))
	                If Len(Trim(rsNews("MediaDesc"))) > 0 Then
	                    MediaDesc = Trim(rsNews("MediaDesc"))
	                Else
	                    MediaDesc = Trim(rsNews("MediaFile"))
	                End If
	                htmlAttachedFiles = htmlAttachedFiles & "<p><img src='http://myqisda.qgroup.corp.com/Images/media.gif'></p>"
	                htmlAttachedFiles = htmlAttachedFiles & "<table width=100% border=0 cellspacing=0 cellpadding=0>"
	                htmlAttachedFiles = htmlAttachedFiles & "<tr><td width=40 height=28>&nbsp;</td>"
	                htmlAttachedFiles = htmlAttachedFiles & "<td valign='middle'><img src='http://myqisda.qgroup.corp.com/Images/media_1.gif'> <a href='http://myqisda.qgroup.corp.com/Images_Talk/" & MediaFile & "'>" & MediaDesc & "</a></td></tr></table>"
	                                    
	            End If
	    
	            htmlAttachedFiles = htmlAttachedFiles & "<script language='javascript'>"
	            htmlAttachedFiles = htmlAttachedFiles & "function showPics(URL){"
	            htmlAttachedFiles = htmlAttachedFiles & "URL=URL+'&PicSize=Middle';"
	            htmlAttachedFiles = htmlAttachedFiles & "window.open(URL, 'Picture','scrollbars=yes,toolbar=no,width=350,height=400,status=no,resizable=yes,top=0,left=0');}"
	            
	            htmlAttachedFiles = htmlAttachedFiles & "function ShowPhoto(URL){"
	            htmlAttachedFiles = htmlAttachedFiles & "nURL = 'http://myqisda.qgroup.corp.com/Album/' + URL;"
	            htmlAttachedFiles = htmlAttachedFiles & "pvindow = window.open(nURL,'thewindow','scrollbars=yes,toolbar=no,status=no,resizable=yes,top=0,left=0,width=640');}"
	            htmlAttachedFiles = htmlAttachedFiles & "</script>"
	            
	            If Len(htmlAttachedFiles) > 0 Then
	                thisDetail = Replace(thisDetail, "###Files###", htmlAttachedFiles)
	            Else
	                thisDetail = Replace(thisDetail, "###Files###", "")
	            End If
	            
	            thisDetail = Replace(thisDetail, "###Employee###", "")
	            
	            thisDetail = Replace(thisDetail, "<BASE href=http://myqisda.qgroup.corp.com/Art_e-mail_Format.Htm>", "")
	            thisDetail = Replace(thisDetail, "<BASE href=http://mybenq/Art_e-mail_Format.Htm>", "")
	            thisDetail = Replace(thisDetail, "http://myqisda.qgroup.corp.com/", "/")
	            thisDetail = Replace(thisDetail, "http://mybenq/", "/")
	            
	            '2017/10/26
	            thisDetail = Replace(thisDetail, "src='/", "src='http://www.myqisda.com/")            
	            thisDetail = Replace(thisDetail, "src=""/", "src=""http://www.myqisda.com/")
	            thisDetail = Replace(thisDetail, "href='/", "href='http://www.myqisda.com/")
	            thisDetail = Replace(thisDetail, "href=""/", "href=""http://www.myqisda.com/")            
	            thisDetail = Replace(thisDetail, "showPics('/", "showPics('http://www.myqisda.com/")
	            
				'save html file
				stm.WriteText thisDetail
				stm.SaveToFile htmlpath,2			
				stm.flush
				stm.Close
				set stm=nothing 	
				
				'HQ才需要推撥
				if rsNews("SiteID") = 2 then
				
					'若10分中內有其他發表的文章，就不要推撥(避免短時間內重複發表文章)
					set rsChkMinute = conn.execute("select * from myBenQ_Talk_List_View where empno='" & empno & "' and TID<>" & tid & " and DateDiff(SECOND,DATEadd(SECOND,-600,GETDATE()),CreDate)>=0")
					if rsChkMinute.eof then
										
						'Announcement,Communication,CIP,CSD,ITS分類才需要推撥
						ChkSecID = "#110#,#67#,#92#,#93#,#95#,#96#,#97#,#103#,#115#,#131#,#132#,#136#,#138#"
						TempSecID = "#" & rsNews("SecID") & "#"										
						if instr(ChkSecID,TempSecID) > 0 then
	
							' Begin -----------------------------------------------------------------------
							' 20171005 Hakkinen QPlay Push Message ----------------------------------------
							' 中介 Web Service
							strMsgSubject = Trim(rsNews("Subject"))															
							
							' 轉換 xml 語法，再轉換 xmlhttp 格式
							strMsgSubject = replace(strMsgSubject," ","%20")					
							strMsgSubject = replace(strMsgSubject,"&","&amp;")
							strMsgSubject = replace(strMsgSubject,"<","&lt;")
							strMsgSubject = replace(strMsgSubject,">","&gt;")
							strMsgSubject = replace(strMsgSubject,"'","&apos;")
							strMsgSubject = replace(strMsgSubject,"""","&quot;")
							strMsgSubject = replace(strMsgSubject,"&","%26")
							strMsgSubject = replace(strMsgSubject,";","%3B")
							
						
							'20171101 Hakkinen 改讀URL
							strMsgContent = "http://www.myqisda.com/htmlfiles/" & FileName								
							
							'QPlayWebServiceUrl = "http://ipsnb.qgroup.corp.com/QPlayPushMessage_Test/PushMessageService.asmx/SendPushMessage"					
							QPlayWebServiceUrl = "http://ip-web01.qgroup.corp.com/QPlayPushMessage/PushMessageService.asmx/SendPushMessage"
							
						
							'推 Qisda
							SoapRequest= "xml=<Parameters><MessageTitle>"&strMsgSubject&"</MessageTitle><MessageText>"&strMsgContent&"</MessageText><SourceUserId>QGROUP\MyQisda</SourceUserId><TemplateTd>999</TemplateTd><MessageType>NEWS</MessageType><MessageSource>Portal</MessageSource><DestinationUserId><Reciver>Qisda</Reciver></DestinationUserId><ServicePassword>2017BJACK#</ServicePassword></Parameters>"
							Call QPlayWebService()
						
							'推 BenQ
							SoapRequest= "xml=<Parameters><MessageTitle>"&strMsgSubject&"</MessageTitle><MessageText>"&strMsgContent&"</MessageText><SourceUserId>QGROUP\MyQisda</SourceUserId><TemplateTd>999</TemplateTd><MessageType>NEWS</MessageType><MessageSource>Portal</MessageSource><DestinationUserId><Reciver>BenQ</Reciver></DestinationUserId><ServicePassword>2017BJACK#</ServicePassword></Parameters>"
							Call QPlayWebService()
							
							Sub QPlayWebService()
							Set xmlhttp = server.CreateObject("Msxml2.XMLHTTP")
							xmlhttp.Open "POST",QPlayWebServiceUrl,false
							xmlhttp.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"
							xmlhttp.Send(SoapRequest)
						                        If xmlhttp.Status = 200 Then
						                                Set xmlDOC = server.CreateObject("MSXML.DOMDocument")
						                                xmlDOC.load(xmlhttp.responseXML)
						                                'Response.Write xmlDOC.load(xmlhttp.responseXML)	
						                                Set xmlDOC = nothing
						                        Else
						                                blnsus=5                              
						                        End if
							End Sub
							' End --------------------------------------------------------------------------					
						
						end if											
					
					end if	
					
				end if
			
			end if
			
		end if
	
	end if		
	
	rsNews.close
	set rsNews = nothing
	conn.close
	set conn = nothing
	
	select case cls
		case "add"
			iMsg = "Thank You For Your Valuable Opinion."
		case "update"
			iMsg = "Content Modify Complete."
		case else
			iMsg = "Thank You For Your Valuable Opinion."		
	end select
	
	theURL = "maileditor.Asp?SecID=" & theSecID
%>

	<Script Language="JavaScript">
		alert("<%=iMsg%>");
		opener.location.replace("<%=theURL%>");
		window.close();
	</Script>
