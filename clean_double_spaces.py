import glob

for dirname in glob.iglob('./content/*'):
    print(dirname)
    for filename in glob.iglob(dirname + '/*.md'):
        print(filename)
        new_content = ''
        for line in open(filename, 'r', encoding='utf-8'):
            new_content += line.rstrip() + '\n'
        with open(filename, 'w', encoding='utf-8', errors="ignore") as fh:
            fh.write(new_content)
