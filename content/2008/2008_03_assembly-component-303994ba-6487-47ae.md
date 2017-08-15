Title: Assembly Component {303994BA-6487-47AE-AF1D-7AF6088EEBDB}
Date: 2008-03-14
Author: Seppe "Macuyiko" vanden Broucke

I recently tried to install the Nokia Software Updater, but it gave me this error:

> Error 1935. An error occured during the installation of assembly component{303994BA-6487-47AE-AF1D-7AF6088EEBDB}.

Quick research showed that this had something to do with MSXML 4.0. So I went [here](http://www.microsoft.com/downloads/details.aspx?familyid=3144b72b-b4f2-46da-b4b6-c5d7485f2b42&displaylang=en) and downloaded the msi installer. Which alas gave me the same error.

It turns out you have to force an uninstall of MSXML 4.0 SP0 or SP1, open a cmd-window and enter the following two lines:

    msiexec /qn /x {35343FF7-939B-401A-87B3-FF90A5123D88}
    msiexec /qn /x {2AEBE10C-D819-4EBF-BC60-03BF2327D340}

Close and *restart*. Yes: you must restart.

Now install the msi. Then install the Nokia software. Everything should work fine now.

