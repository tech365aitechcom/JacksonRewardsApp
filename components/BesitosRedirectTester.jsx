"use client";
import React, { useState } from 'react';
import { resolveBesitosRedirect, testRedirectResolution } from '@/lib/redirectResolver';

/**
 * Besitos Redirect Tester Component
 * Use this to test and debug Besitos redirect resolution
 */
export default function BesitosRedirectTester() {
    const [testUrl, setTestUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTest = async () => {
        if (!testUrl) return;

        setLoading(true);
        setResult(null);

        try {
            console.log('🧪 Testing redirect resolution for:', testUrl);

            const resolvedUrl = await resolveBesitosRedirect(testUrl);

            setResult({
                originalUrl: testUrl,
                resolvedUrl: resolvedUrl,
                success: true,
                isStoreUrl: isStoreUrl(resolvedUrl)
            });

            console.log('✅ Test completed:', resolvedUrl);

        } catch (error) {
            console.error('❌ Test failed:', error);
            setResult({
                originalUrl: testUrl,
                error: error.message,
                success: false
            });
        } finally {
            setLoading(false);
        }
    };

    const isStoreUrl = (url) => {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();

            return (
                hostname.includes('play.google.com') ||
                hostname.includes('apps.apple.com') ||
                hostname.includes('itunes.apple.com') ||
                hostname.includes('amazon.com') ||
                url.startsWith('market://') ||
                url.startsWith('intent://')
            );
        } catch {
            return false;
        }
    };

    return (
        <div className="p-4 bg-gray-900 rounded-lg">
            <h3 className="text-white text-lg font-semibold mb-4">
                🧪 Besitos Redirect Tester
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Test URL (Besitos redirect URL):
                    </label>
                    <input
                        type="url"
                        value={testUrl}
                        onChange={(e) => setTestUrl(e.target.value)}
                        placeholder="https://wall.besitos.ai/redirect/..."
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <button
                    onClick={handleTest}
                    disabled={loading || !testUrl}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Testing...' : 'Test Redirect'}
                </button>

                {result && (
                    <div className="mt-4 p-4 bg-gray-800 rounded">
                        <h4 className="text-white font-medium mb-2">Test Results:</h4>

                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-400">Original URL:</span>
                                <span className="text-white ml-2 break-all">{result.originalUrl}</span>
                            </div>

                            {result.success ? (
                                <>
                                    <div>
                                        <span className="text-gray-400">Resolved URL:</span>
                                        <span className="text-white ml-2 break-all">{result.resolvedUrl}</span>
                                    </div>

                                    <div>
                                        <span className="text-gray-400">Is Store URL:</span>
                                        <span className={`ml-2 ${result.isStoreUrl ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {result.isStoreUrl ? '✅ Yes' : '⚠️ No'}
                                        </span>
                                    </div>

                                    {result.isStoreUrl && (
                                        <div className="mt-2">
                                            <button
                                                onClick={() => window.open(result.resolvedUrl, '_blank')}
                                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                Open Store URL
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div>
                                    <span className="text-red-400">Error:</span>
                                    <span className="text-white ml-2">{result.error}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="text-xs text-gray-400">
                    <p>💡 <strong>How to use:</strong></p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>Get a game URL from your Besitos API response</li>
                        <li>Paste it in the input field above</li>
                        <li>Click "Test Redirect" to see where it resolves</li>
                        <li>If it resolves to a store URL, the redirect is working correctly</li>
                        <li>If it resolves to a Besitos wall page, there's an issue with the redirect</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
