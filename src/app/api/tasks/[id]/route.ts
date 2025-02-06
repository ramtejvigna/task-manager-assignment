import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Task } from '@/lib/models/Task';


export async function PUT(request: NextRequest) {
    try {
        await dbConnect();
        const taskData = await request.json();

        // Extract task ID from URL
        const id = request.nextUrl.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
        }

        const task = await Task.findByIdAndUpdate(id, taskData, { new: true });

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(task);
    } catch (err) {
        return NextResponse.json({ error: "Failed to update task", details: err }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();

        const id = request.nextUrl.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
        }

        await Task.findByIdAndDelete(id);
        return NextResponse.json({ message: "Task deleted" });
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete task", err }, { status: 500 });
    }
}