# AddressToGoogleMap 🗺️

A modern Angular application that allows users to input their address and automatically displays the location on Google Maps with interactive features.

## 🚀 Features

- **Smart Address Form**: Comprehensive address input with country, state, and city selection
- **Real-time Map Display**: Automatically displays entered addresses on an interactive Google Map
- **Location Validation**: Dynamic form validation with country-state-city dependency
- **Responsive Design**: Built with Angular Material for a modern, mobile-friendly interface
- **QR Code Generation**: Generate QR codes for addresses (feature in development)
- **Interactive Map Controls**: Pan, zoom, and explore the mapped location

## 🛠️ Technology Stack

- **Frontend**: Angular 19 with TypeScript
- **UI Framework**: Angular Material
- **Maps**: Google Maps JavaScript API via @angular/google-maps
- **Location Data**: Country-State-City library for location hierarchies
- **Styling**: SCSS with Material Design principles
- **Code Quality**: ESLint + Prettier for consistent code formatting

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Google Maps API key
- Angular CLI (`npm install -g @angular/cli`)

## 🔧 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/addressToGoogleMap.git
    cd addressToGoogleMap/address-mapper
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up Google Maps API**
    - Get a Google Maps JavaScript API key from [Google Cloud Console](https://console.cloud.google.com/)
    - Enable the following APIs:
        - Maps JavaScript API
        - Geocoding API
        - Places API (if using autocomplete features)

4. **Configure the API key**
    - Add your Google Maps API key to `src/index.html`:
    ```html
    <script
        async
        defer
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"
    ></script>
    ```

## 🚀 Running the Application

1. **Development server**

    ```bash
    npm start
    ```

    Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

2. **Build for production**
    ```bash
    npm run build
    ```
    The build artifacts will be stored in the `dist/` directory.

## 📝 Usage

1. **Enter Address Details**
    - Select your country from the dropdown
    - Choose your state/province
    - Select your city
    - Fill in street address, optional address line 2, and postal code

2. **View on Map**
    - The map automatically updates as you complete the address form
    - A marker shows the exact location of your entered address
    - Use map controls to zoom in/out and explore the area

3. **Generate QR Code** (Coming Soon)
    - Click the "Generate QR Code" button to create a QR code for your address

## 🏗️ Project Structure

```
src/app/
├── features/
│   └── address-map/
│       ├── address-map.component.*         # Main container component
│       ├── components/
│       │   ├── address-form/               # Address input form
│       │   └── google-map/                 # Interactive map display
│       ├── models/                         # TypeScript interfaces
│       └── services/
│           └── location.service.ts         # Location data service
└── ...
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Angular Style Guide** conventions

Run `npm run format:lint` to automatically format and fix linting issues.

## 🔮 Future Enhancements

- [ ] QR code generation implementation
- [ ] Address search history
- [ ] Multiple address markers
- [ ] Route planning between addresses
- [ ] Address sharing functionality
- [ ] Offline map caching
- [ ] Address validation API integration

## 🆕 Recent Updates

- **March 2025**: Updated to use Google Maps `PlaceAutocompleteElement` instead of deprecated `Autocomplete` API for better future compatibility and performance

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/addressToGoogleMap/issues) section
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Maps JavaScript API for mapping functionality
- Angular Material team for the UI components
- Country-State-City library for location data
- Angular team for the amazing framework

---

**Made with ❤️ using Angular and Google Maps**
