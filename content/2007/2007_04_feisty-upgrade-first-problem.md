Title: Feisty Upgrade - First Problem
Date: 2007-04-30
Author: Seppe "Macuyiko" vanden Broucke

We recently updated all our Ubuntu machines from Edgy to Feisty. Updating went smooth, apart from a few problems.  
The first problem was that X was freezing at random intervals. Xorg log mentioned nothing special, but the GDM log did:  
> Error in I830WaitLpRing(), now is 7023360, start is 7021359  > pgetbl_ctl: 0x3ffc0001 pgetbl_err: 0x0  > ipeir: 0 iphdr: 1810000  > LP ring tail: 9b38 head: 938c len: 1f801 start 0  > eir: 0 esr: 0 emr: ffff  > instdone: ffc0 instpm: 0  > memmode: 306 instps: f0000  > hwstam: ffff ier: 0 imr: ffff iir: 0  > space: 129100 wanted 131064> > Fatal server error:  > lockup
So I did the only thing I could think of: I removed the Videoram lines from xorg.conf. And the freezes seem to have stopped. 
