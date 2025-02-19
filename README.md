# Image Metadata Extractor

A simple command-line tool to extract and display metadata from image files.

## Installation

```bash
npm install
```

## Usage

```bash
node index.js path/to/image.jpg
```

You can also process multiple images at once:

```bash
node index.js image1.jpg image2.png image3.jpeg
```

## Features

- Extract EXIF data from images
- Display camera information (make, model, settings)
- Show GPS coordinates if available
- Support for common image formats (JPEG, PNG, TIFF, etc.)

## Dependencies

- exifr: For reading EXIF metadata from images

## Example Output

```
=== Metadata for IMG_1234.jpg ===
Camera: Canon EOS 5D Mark IV
Date: 2023:12:15 14:30:20
Exposure: 1/125s
Aperture: f/2.8
ISO: 800
Focal Length: 85mm
GPS: 37.774929, -122.419416
```