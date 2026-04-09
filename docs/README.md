# Cyber Tomb · Setup & Configuration Guide

This document explains how to set up Authentication and Sharing for your Cyber Tomb project.

## 1. GitHub OAuth Configuration (Auth.js)

To enable GitHub login, you need to create a GitHub OAuth App:

1.  Go to **GitHub Settings** > **Developer settings** > **OAuth Apps** > **New OAuth App**.
2.  **Application Name**: `Cyber Tomb`
3.  **Homepage URL**: `http://localhost:3000` (for local dev) or your Vercel deployment URL.
4.  **Authorization callback URL**:
    *   Local: `http://localhost:3000/api/auth/callback/github`
    *   Production: `https://your-domain.vercel.app/api/auth/callback/github`
5.  Click **Register application**.
6.  Generate a **Client Secret**.
7.  Copy the **Client ID** and **Client Secret** into your `.env` file.

## 2. Supabase Setup

1.  Create a new project on **Supabase**.
2.  In the **SQL Editor**, paste and run the contents of `supabase_schema.sql` located in the project root.
3.  Go to **Project Settings** > **API** to find your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4.  Enable **Supabase Realtime** for the `global_stats` table if you want the global merit counter to update in real-time.

## 3. MiniMax AI Configuration

1.  Sign up for **MiniMax**.
2.  Get your **Group ID** and **API Key**.
3.  Choose a model (e.g., `abab6.5-chat`).
4.  Set these values in your `.env`.

## 4. x402 Protocol (Sharing & Gifting)

The x402 protocol implementation in this project is currently a **mocked version** that follows the visual and logic patterns of the [Clawbot Market](https://github.com/adminlove520/clawbot-market).

*   The **GiftBox** component simulates the handshake and transaction signing.
*   To integrate with a real x402 wallet, you would replace the `setTimeout` in `handlePay` with a real protocol call (e.g., `window.x402.pay(...)`).

## 5. Twitter (X) Sharing

*   Sharing is implemented via **Twitter Web Intent**.
*   It dynamically constructs a pre-filled tweet with the tomb's name, cause of death, and AI-generated epitaph.
*   Next.js **Dynamic Metadata** and **force-dynamic** page settings ensure that when you share a link, Twitter can fetch the correct info for the preview card.

---

"Here lies a lobster. They lived, they coded, they were deleted."
