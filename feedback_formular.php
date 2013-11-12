<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />

<title>Wohnstandortsuche</title>
<meta name="keywords" content="Wohnstandortsuche" />
<meta name="description" content="Wohnstandortsuche Gruppe 3" />
<link href="../style.css" rel="stylesheet" type="text/css" />
</head>
<body>

<div id="logoall">
<div id="logo">
        <h1><a href="../startseite.html">Wohnstandortsuche Wien</a></h1>
</div>
</div>
<div id="header">
        <div id="menu">
                <ul>
                        <li class="button"><a href="../startseite.html">Startseite</a></li>
                        <li class="button"><a href="../Sites/dasprojekt.html">Das Projekt</a></li>
                        <li class="button"><a href="../Sites/applikation.html">Applikation zur Wohnstandortsuche</a></li>
                        <li class="button"><a href="../intranet/intern.html">Intern</a></li>
                        <li class="button"><a href="../Sites/team.html">Team</a></li>
                        <li class="button" class="last"><a href="../Sites/impressum.html">Impressum</a></li>
                </ul>
        </div>
</div>


<div id="page">

        <div id="bodystyle">
        <h1 class="title">Feedback Formular</h1>

        <form method="POST" action="feedback_send.php">
         <input type="radio" name="geschlecht" value="Frau"/> Frau
         <input type="radio" name="geschlecht" value="Herr"/> Herr<br />
         <table>
         <tr><td>Name:</td>
         <td><input type="text" name="name" size="50" /></td>
         </tr>
         <tr><td>E-Mail: </td>
         <td><input type="text" name="email" size="50" /></td>
         </tr>
         <tr><td>Ihre Koordinaten </td>
         <td><input type="text" name="longitude" size="50" /></td>
         <td><input type="text" name="latitude" size="50" /></td>
         </tr>
         </table>
         Feedback: <br />
         <textarea name="message" rows="10" cols="50"></textarea>
         <br />
         <input type="checkbox" name="team" checked="checked" value="ON" />
         Ich bin Mitglied des geoweb-Teams <br /><br />
         <input type="submit" value="Abschicken">
         <input type="reset" value="Zurücksetzen"> <br /><br />
         Ihr Feedback wird per E-Mail an die Autoren/innen zugestellt<br>
         und in der Projekt-Datenbank gespeichert.<br />
        </form>

<p>geoweb.m10 (JB), Beispiel ausgehend von<br />
<a href="http://www.thesitewizard.com/archive/feedbackphp.shtml"
target="_blank"> PHP Tutorial: Feedback Form Script</a> </p>
        </div>

                <div style="clear: both;">&nbsp;</div>
</div>


<div id="unten">
        <div id="unten1">
        <p id="fusszeile">© 2013 Gruppe 3, Webbasierte Geoinformation im Planungsprozess</a></p>
        </div>
</div>

</body>
</html>
