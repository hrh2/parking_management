# Parking Management System Architecture Documentation

This repository contains architectural documentation for the Parking Management System (PMS) backend.

## Overview

The Parking Management System backend is a Node.js application built with Express.js that provides APIs for managing parking stations, slots, bookings, vehicles, and tickets. It follows the MVC (Model-View-Controller) architecture pattern and uses MongoDB as its database.

## Architecture Diagrams

Two different representations of the system architecture are provided:

1. **ASCII Art Diagram** (`pms_backend_architecture.md`): A text-based representation of the system architecture that can be viewed directly in any text editor or terminal.

2. **Mermaid Diagram** (`pms_backend_architecture_mermaid.md`): A more visually appealing representation using Mermaid diagram syntax, which can be rendered as a proper flowchart in GitHub, GitLab, or any Markdown viewer that supports Mermaid.

## Viewing the Diagrams

### ASCII Art Diagram
The ASCII art diagram can be viewed directly in any text editor or terminal. Simply open the `pms_backend_architecture.md` file.

### Mermaid Diagram
To view the Mermaid diagram:

1. **GitHub**: If you push this repository to GitHub, the Mermaid diagram will automatically render in the `pms_backend_architecture_mermaid.md` file.

2. **VS Code**: If you're using Visual Studio Code, you can install the "Markdown Preview Mermaid Support" extension to view the diagram.

3. **Mermaid Live Editor**: You can copy the Mermaid code (the content between the triple backticks with the `mermaid` tag) and paste it into the [Mermaid Live Editor](https://mermaid.live/) to view and edit the diagram.

4. **Other Markdown Viewers**: Many modern Markdown viewers support Mermaid diagrams. Check your specific tool's documentation.

## Architecture Components

The architecture documentation covers:

1. **System Overview**: High-level description of the system
2. **Component Descriptions**: Detailed explanations of each component
3. **Data Flow**: How data moves through the system
4. **Authentication Flow**: The process for user authentication
5. **Booking Flow**: The process for booking parking slots

## Updating the Diagrams

If you make changes to the system architecture, you should update both diagram files to keep the documentation in sync with the actual implementation.

For the Mermaid diagram, you can use the [Mermaid Live Editor](https://mermaid.live/) to edit the diagram visually and then copy the updated code back to the `pms_backend_architecture_mermaid.md` file.