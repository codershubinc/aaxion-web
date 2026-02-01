"use client";
import { useState } from 'react';
import { authenticatedFetch, API_BASE, getToken } from '@/lib/api';
import { Upload } from 'lucide-react';

interface AddMovieFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AddMovieForm({ onSuccess, onCancel }: AddMovieFormProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const file = formData.get('file') as File;
        const token = getToken();

        try {
            // 1. Get Root Path from backend
            const rootRes = await authenticatedFetch(`/api/system/get-root-path`);
            if (!rootRes.ok) throw new Error('Failed to get system info');
            const { root_path } = await rootRes.json();

            // 2. Upload File
            // Note: In Tauri, we might prefer using the fs plugin, but sticking to fetch for web compatibility
            const targetDir = `${root_path}/.aaxion/movies`;
            const uploadData = new FormData();
            uploadData.append('file', file);

            const uploadRes = await fetch(`${API_BASE}/files/upload?dir=${encodeURIComponent(targetDir)}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData
            });

            if (!uploadRes.ok) throw new Error('Upload failed');

            // 3. Add Metadata to DB
            const metaData = {
                title: formData.get('title'),
                file_id: 0,
                file_path: `${targetDir}/${file.name}`,
                description: formData.get('description'),
                poster_path: formData.get('poster_path')
            };

            const dbRes = await fetch(`${API_BASE}/api/movies/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(metaData)
            });

            if (!dbRes.ok) throw new Error('Failed to save metadata');

            alert('Movie Added!');
            onSuccess();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] w-full flex items-center justify-center">
            <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                    <Upload className="w-6 h-6 text-blue-500" />
                    Add New Movie
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Movie Title</label>
                            <input type="text" name="title" required className="form-input-dark" placeholder="e.g. Inception" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Movie File</label>
                            <input type="file" name="file" required className="form-input-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Poster URL (Optional)</label>
                            <input type="text" name="poster_path" className="form-input-dark" placeholder="https://example.com/poster.jpg" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                            <textarea name="description" rows={3} className="form-input-dark" placeholder="Enter movie description..." />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-gray-400 hover:text-white font-medium">Cancel</button>
                        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Uploading...' : 'Save Movie'}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
        .form-input-dark {
          @apply w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 transition-colors;
        }
      `}</style>
        </div>
    );
}