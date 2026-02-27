import React from 'react';

// A fake MDN / React style documentation page
export const MdnDocSkin: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-[#1c1e21] flex">
            {/* Sidebar */}
            <aside className="hidden md:block w-72 h-screen overflow-y-auto border-r border-[#dadde1] p-4 bg-[#f7f9fa] top-0 sticky">
                <h2 className="font-bold text-lg mb-6 text-[#1c1e21]">Documentation</h2>
                <div className="space-y-2">
                    <div className="font-semibold text-sm text-[#606770] uppercase mt-4 mb-2">Getting Started</div>
                    <div className="text-[#1877f2] font-medium py-1">Installation</div>
                    <div className="text-[#1c1e21] hover:text-[#1877f2] cursor-pointer py-1">Configuration</div>
                    <div className="text-[#1c1e21] hover:text-[#1877f2] cursor-pointer py-1">Deployment</div>

                    <div className="font-semibold text-sm text-[#606770] uppercase mt-6 mb-2">Core Concepts</div>
                    <div className="text-[#1c1e21] hover:text-[#1877f2] cursor-pointer py-1">Components</div>
                    <div className="text-[#1c1e21] hover:text-[#1877f2] cursor-pointer py-1">State & Lifecycle</div>
                    <div className="text-[#1c1e21] hover:text-[#1877f2] cursor-pointer py-1">Event Handling</div>

                    <div className="font-semibold text-sm text-[#606770] uppercase mt-6 mb-2">API Reference</div>
                    <div className="text-[#1c1e21] hover:text-[#1877f2] cursor-pointer py-1">React.Component</div>
                    <div className="text-[#1c1e21] hover:text-[#1877f2] cursor-pointer py-1">ReactDOM</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl px-8 py-12 lg:px-16">
                <div className="text-sm text-[#606770] mb-4">Docs &gt; Getting Started &gt; Installation</div>
                <h1 className="text-4xl font-bold mb-6 font-sans">Installation</h1>

                <p className="text-lg leading-relaxed mb-6">
                    This page explains how to properly install and configure the library in your application.
                    We recommend using a modern packager like Webpack or Vite to handle dependency management.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-[#dadde1]">Prerequisites</h2>
                <p className="mb-4 leading-relaxed">Before you begin, ensure you have the following installed on your local machine:</p>
                <ul className="list-disc pl-8 mb-6 space-y-2">
                    <li>Node.js (version 18.0 or higher)</li>
                    <li>npm or yarn package manager</li>
                    <li>Basic understanding of ES6 syntax</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-[#dadde1]">Adding to a New Project</h2>
                <p className="mb-4 leading-relaxed">To create a new project with all necessary dependencies configured, run the following command in your terminal:</p>

                <div className="bg-[#282c34] text-[#abb2bf] p-4 rounded-md font-mono text-sm mb-6 overflow-x-auto">
                    <code>$ npx create-react-app my-app --template typescript</code>
                </div>

                <p className="mb-4 leading-relaxed">This will create a new directory called <code>my-app</code> and install all required packages. This process might take a few minutes depending on your internet connection.</p>

                <div className="bg-[#e6f2ff] border-l-4 border-[#1877f2] p-4 text-[#1c1e21] my-8 rounded-r">
                    <strong>Note:</strong> If you are upgrading from an older version, please refer to our Migration Guide for detailed instructions on handling breaking changes.
                </div>

                <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-[#dadde1]">Manual Installation</h2>
                <p className="mb-4 leading-relaxed">If you prefer to integrate it into an existing project setup manually, you can install the individual packages:</p>

                <div className="bg-[#282c34] text-[#abb2bf] p-4 rounded-md font-mono text-sm mb-16 overflow-x-auto">
                    <code>$ npm install react react-dom</code>
                </div>
            </main>
        </div>
    );
};
