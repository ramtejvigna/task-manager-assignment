import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Task } from '@/lib/models/Task';

export async function GET() {
    try {
        await dbConnect();
        const tasks = await Task.find({}).sort({ createdAt: -1 });
        return NextResponse.json(tasks);
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch tasks", err }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const taskData = await request.json();
        const task = await Task.create(taskData);
        return NextResponse.json(task);
    } catch (err) {
        return NextResponse.json({ error: "Failed to create task", err }, { status: 500 });
    }
}
