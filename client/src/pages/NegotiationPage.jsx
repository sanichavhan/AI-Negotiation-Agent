import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNegotiation } from '../context/NegotiationContext';

const NegotiationPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentSession, messages, roundNumber } = useNegotiation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Negotiation Game</h1>
            <button
              onClick={() => navigate('/leaderboard')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Chat Area */}
          <div className="col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Chat with AI Seller</h2>

            {/* Messages */}
            <div className="border rounded-lg h-96 overflow-y-auto mb-4 p-4 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-center">No messages yet. Start negotiating!</p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-4 ${
                      msg.sender === 'user'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                Send
              </button>
            </div>
          </div>

          {/* Price Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Negotiation Status</h3>

            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2">Current Round</p>
              <p className="text-3xl font-bold text-indigo-600">{roundNumber}</p>
            </div>

            {currentSession && (
              <>
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">Initial Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${currentSession.initialPrice}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">Current Price</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${currentSession.currentPrice}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">Discount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${currentSession.initialPrice - currentSession.currentPrice}
                  </p>
                </div>
              </>
            )}

            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold">
              Accept Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationPage;
