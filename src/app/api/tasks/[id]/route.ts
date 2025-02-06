import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Task } from '@/lib/models/Task';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const taskData = await request.json();
        const task = await Task.findByIdAndUpdate(params.id, taskData, { new: true });
        return NextResponse.json(task);
    } catch (err) {
        return NextResponse.json({ error: "Failed to update task", err }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        await Task.findByIdAndDelete(params.id);
        return NextResponse.json({ message: "Task deleted" });
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete task", err }, { status: 500 });
    }
}