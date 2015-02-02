# setup vagrant

- default values in puphpet/config.yaml are: `192.168.56.112  local.app`
- apache serves `dist` directory

# serve

- `gulp` (watch with livereload)
- `gulp dist` (dist with rev and min)

# deployment

- create 3 artifacts:
	- `Acme`: your own PHP code
	- `dist`: public webserver
	- `vendor`: composer stuff

# structure

```
	sass/
	|
	|– base/
	|   |– _reset.scss       # Reset/normalize
	|   |– _typography.scss  # Typography rules
	|   ...                  # Etc…
	|
	|– components/
	|   |– _buttons.scss     # Buttons
	|   |– _carousel.scss    # Carousel
	|   |– _cover.scss       # Cover
	|   |– _dropdown.scss    # Dropdown
	|   ...                  # Etc…
	|
	|– layout/
	|   |– _navigation.scss  # Navigation
	|   |– _grid.scss        # Grid system
	|   |– _header.scss      # Header
	|   |– _footer.scss      # Footer
	|   |– _sidebar.scss     # Sidebar
	|   |– _forms.scss       # Forms
	|   ...                  # Etc…
	|
	|– pages/
	|   |– _home.scss        # Home specific styles
	|   |– _contact.scss     # Contact specific styles
	|   ...                  # Etc…
	|
	|– themes/
	|   |– _theme.scss       # Default theme
	|   |– _admin.scss       # Admin theme
	|   ...                  # Etc…
	|
	|– utils/
	|   |– _variables.scss   # Sass Variables
	|   |– _functions.scss   # Sass Functions
	|   |– _mixins.scss      # Sass Mixins
	|   |– _helpers.scss     # Class & placeholders helpers
	|
	|– vendors/
	|   |– _bootstrap.scss   # Bootstrap
	|   |– _jquery-ui.scss   # jQuery UI
	|   ...                  # Etc…
	|
	|
	`– main.scss             # primary Sass file
```