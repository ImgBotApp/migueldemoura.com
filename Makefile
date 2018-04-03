default: clean setup

setup:
	bundle install
	npm install

serve:
	bundle exec jekyll serve

clean:
	rm -f package-lock.json Gemfile.lock
	rm -rf .jekyll-cache/ node_modules/ _site/
