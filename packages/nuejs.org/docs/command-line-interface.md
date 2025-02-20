
# Command Line Interface
A list of available commands and options

## Options
To view the help output, run:

```sh
nue --help
```

This returns the following output:

```md
Usage
  nue [command] [options] [file_matches]
  nue -v or --version
  nue -h or --help
```

### Commands

- **serve**: Starts the development server, allowing you to view your site in real-time. This is the default command if no other command is specified.

- **build**: Compiles your site and prepares it for production deployment, placing the output in the specified directory.

- **create**: Generates a new project using a starter template, helping you quickly set up a new site.

- **init**: Regenerates the `/@nue` system files, useful for resetting your environment or ensuring you have the latest configurations.

### Options

- **-r or --root**: Specifies the source directory for the project. By default, this is set to `"."`, which refers to the current working directory.

- **-p or --production**: Builds the production version of your site or shows production statistics. This is essential for optimizing your site for performance.

- **-e or --environment**: Reads additional options to override defaults specified in the `site.yaml` file, allowing for greater customization.

- **-n or --dry-run**: Displays what would be built without actually creating any outputs. This is useful for previewing changes.

- **-b or --esbuild**: Uses esbuild as the bundler for your assets. Note that you need to install esbuild manually for this to work.

- **-l or --lcss**: Uses lightningcss as the minifier for your CSS. Note that you need to install lightningcss manually for this to work.

- **-P or --port**: Sets the port number to serve the site on. This is particularly useful if the default port (`8080`) is already in use.

### File Matches

You can specify file patterns to only build certain files. For example:
- Running `nue build .ts .css` will build all TypeScript and CSS files in the project.


## Examples

### Serve the Current Directory

```sh
nue
```
This command starts the development server for the current directory.

### Build Everything

```sh
nue build
```
Compiles the entire site and prepares it for production.

### Build for Production with Extra Config

```sh
nue build --production --environment staging.yaml
```
This command builds the production version of the site, using a staging configuration file for custom settings.

### Build All Markdown and CSS Files

```sh
nue build .md .css
```
This command compiles only Markdown and CSS files, ignoring other file types.


## Example Output

Here's an example output of the `nue build` command. The operation usually takes less than 100 milliseconds, even with hundreds of files:

[bunny-video]:
  videoId: 45b73e3a-3edd-47af-bcd8-49039496b107
  width: 600
