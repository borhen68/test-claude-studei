import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * PUT /api/books/:bookId/customize
 * Update book customization settings
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const { bookId } = params;
    const body = await request.json();

    // Extract customization fields
    const {
      // Cover customization
      coverTitle,
      coverFont,
      coverTextColor,
      coverTextPosition,
      coverLayout,
      coverImageUrl,
      
      // Theme customization
      customizationTheme,
      
      // Book specs
      paperType,
      coverType,
      bookSize,
      desiredPageCount,
      
      // Calendar customization
      customEvents,
      monthLayout,
      weekStartDay,
      calendarThemeId,
      photosPerMonth,
      
      // Card customization
      cardMessage,
      cardFont,
      cardLayout,
      envelopeStyle,
    } = body;

    // Build update object with only provided fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (coverTitle !== undefined) updateData.coverTitle = coverTitle;
    if (coverFont !== undefined) updateData.coverFont = coverFont;
    if (coverTextColor !== undefined) updateData.coverTextColor = coverTextColor;
    if (coverTextPosition !== undefined) updateData.coverTextPosition = coverTextPosition;
    if (coverLayout !== undefined) updateData.coverLayout = coverLayout;
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;
    
    if (customizationTheme !== undefined) updateData.customizationTheme = customizationTheme;
    
    if (paperType !== undefined) updateData.paperType = paperType;
    if (coverType !== undefined) updateData.coverType = coverType;
    if (bookSize !== undefined) updateData.bookSize = bookSize;
    if (desiredPageCount !== undefined) updateData.desiredPageCount = desiredPageCount;
    
    if (customEvents !== undefined) updateData.customEvents = customEvents;
    if (monthLayout !== undefined) updateData.monthLayout = monthLayout;
    if (weekStartDay !== undefined) updateData.weekStartDay = weekStartDay;
    if (calendarThemeId !== undefined) updateData.calendarThemeId = calendarThemeId;
    if (photosPerMonth !== undefined) updateData.photosPerMonth = photosPerMonth;
    
    if (cardMessage !== undefined) updateData.cardMessage = cardMessage;
    if (cardFont !== undefined) updateData.cardFont = cardFont;
    if (cardLayout !== undefined) updateData.cardLayout = cardLayout;
    if (envelopeStyle !== undefined) updateData.envelopeStyle = envelopeStyle;

    // Update the book
    const [updatedBook] = await db
      .update(books)
      .set(updateData)
      .where(eq(books.id, bookId))
      .returning();

    if (!updatedBook) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      book: updatedBook,
    });
  } catch (error) {
    console.error('Failed to update customization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customization' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/books/:bookId/customize
 * Get current customization settings
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const { bookId } = params;

    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId));

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Return customization settings
    return NextResponse.json({
      success: true,
      customization: {
        coverTitle: book.coverTitle,
        coverFont: book.coverFont,
        coverTextColor: book.coverTextColor,
        coverTextPosition: book.coverTextPosition,
        coverLayout: book.coverLayout,
        customizationTheme: book.customizationTheme,
        paperType: book.paperType,
        coverType: book.coverType,
        bookSize: book.bookSize,
        desiredPageCount: book.desiredPageCount,
        customEvents: book.customEvents,
        monthLayout: book.monthLayout,
        weekStartDay: book.weekStartDay,
        calendarThemeId: book.calendarThemeId,
        photosPerMonth: book.photosPerMonth,
        cardMessage: book.cardMessage,
        cardFont: book.cardFont,
        cardLayout: book.cardLayout,
        envelopeStyle: book.envelopeStyle,
      },
    });
  } catch (error) {
    console.error('Failed to get customization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get customization' },
      { status: 500 }
    );
  }
}
