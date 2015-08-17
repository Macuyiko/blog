Title: Joomla 1.5 Security Fixes
Author: Seppe "Macuyiko" vanden Broucke
Date: 2014-09-10 14:44

Although I now have moved on -- for most part -- from PHP, I am still maintaining a number of websites build on top of Joomla. Ever since Joomla 3.0 was released, Joomla 1.5 has reached end-of-life status, meaning that there will be no more updates nor security fixes for this version, thus settling the latest version at Joomla 1.5.26.

Since Joomla 1.5.26 is kind of a mess security-wise, all users are advices to upgrade to Joomla 2 or 3 as soon as possible.
Easier said than done, since the sites I'm dealing with involve a number of highly customised themes and plugins, and I can not really permit to spend a week to updating and rebuilding all of them.

For those in the same boat (and mainly as a reminder to myself), I'm listing here two crucially important steps which you'll want to do to make Joomla 1.5.26 installations a tad more secure.

First of all, completely remove the outdated, horrible TinyMCE editor, as this has been the culprit and root-cause behind many exploits out there in the wild. Perform the following steps to do this cleanly:

1. Go to the control panel in your Joomla admin portal and change the site-wide editor to "No editor", or to another editor if you have one installed.
2. Deactivate TinyMCE under the plugin manager in your Joomla admin portal.
3. Remove all TinyMCE related files: `plugins/editors/tinymce.php`, `plugins/editors/tinymce.xml` and the directory `plugins/editors/tinymce`.

Second, download the unofficial security patch [here](http://anything-digital.com/blog/security-updates/joomla-updates/joomla-15-security-patch-made-easy-to-install.html). This patch fixes a vulnerability which allows for unauthorized file uploads.

These two steps should provide you with some time to work towards a long-term upgrade plan.

