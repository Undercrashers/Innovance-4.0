import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import { addContactToBrevo, sendRegistrationEmail } from '@/lib/brevo';

interface RegistrationData {
  fullName: string;
  rollNumber: string;
  email: string;
  phone: string;
  university: string;
  gender: string;
  uniqueId: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: RegistrationData = await request.json();

    // Validate required fields
    if (
      !body.fullName ||
      !body.email ||
      !body.rollNumber ||
      !body.phone ||
      !body.university ||
      !body.gender
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingRegistration = await Registration.findOne({
      email: body.email,
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create and save new registration
    const registration = new Registration({
      fullName: body.fullName,
      rollNumber: body.rollNumber,
      email: body.email,
      phone: body.phone,
      university: body.university,
      gender: body.gender,
      uniqueId: body.uniqueId,
      timestamp: new Date(body.timestamp),
    });

    await registration.save();

    const [contactResult, emailResult] = await Promise.all([
      addContactToBrevo({
        email: body.email,
        fullName: body.fullName,
        phone: body.phone,
        university: body.university,
        gender: body.gender,
        rollNumber: body.rollNumber,
        uniqueId: body.uniqueId,
      }),
      sendRegistrationEmail({
        email: body.email,
        fullName: body.fullName,
        uniqueId: body.uniqueId,
        rollNumber: body.rollNumber,
        phone: body.phone,
        university: body.university,
      }),
    ]);

    // Log Brevo results (don't fail registration if Brevo fails)
    if (!contactResult.success) {
      console.warn('Failed to add contact to Brevo:', contactResult.error);
    }
    if (!emailResult.success) {
      console.warn('Failed to send email via Brevo:', emailResult.error);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration saved successfully',
        uniqueId: body.uniqueId,
        registrationId: registration._id,
        emailSent: emailResult.success,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save registration' },
      { status: 500 }
    );
  }
} // ✅ POST function closes here

// ✅ GET is now a separate top-level export
export async function GET() {
  try {
    await connectDB();

    const registrations = await Registration.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

// ✅ DELETE is now a separate top-level export
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    const result = await Registration.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}
