import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Shield, Clock, Mail, Key, Download, CheckCircle, AlertTriangle, Heart, FileText, Smartphone } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const HowItWorksPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/15 to-purple-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-600/10 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/15 to-blue-600/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '4s', animationDuration: '7s' }} />
      </div>

      <Layout>
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}
        >
          <div 
            className={`mb-8 transition-all duration-800 ease-out ${
              isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div 
            className={`text-center mb-16 transition-all duration-800 ease-out ${
              isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              How Digital Legacy Transfer Works
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              A secure, automated system that ensures your memories and final wishes reach your loved ones when the time comes.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-8"></div>
          </div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card 
              className={`backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transition-all duration-800 ease-out ${
                isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-white mb-3">Secure & Private</h3>
                <p className="text-white/80">Your data is encrypted and protected. Only designated heirs can access your legacy.</p>
              </CardContent>
            </Card>

            <Card 
              className={`backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transition-all duration-800 ease-out ${
                isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-white mb-3">Automated</h3>
                <p className="text-white/80">No manual intervention needed. The system activates automatically when required.</p>
              </CardContent>
            </Card>

            <Card 
              className={`backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transition-all duration-800 ease-out ${
                isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-white mb-3">No Account Required</h3>
                <p className="text-white/80">Your heirs don't need to create accounts. Simple access with verification codes.</p>
              </CardContent>
            </Card>
          </div>

          {/* Step-by-Step Process */}
          <div className="mb-16">
            <h2 
              className={`text-3xl font-serif font-bold text-white text-center mb-12 transition-all duration-800 ease-out ${
                isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'
              }`}
              style={{ transitionDelay: '900ms' }}
            >
              The Complete Process
            </h2>

            <div className="space-y-12">
              {/* Step 1 */}
              <div 
                className={`flex flex-col lg:flex-row items-center gap-8 transition-all duration-800 ease-out ${
                  isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: '1000ms' }}
              >
                <div className="lg:w-1/2">
                  <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-xl font-bold text-white">1</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white">Setup Your Legacy</h3>
                      </div>
                      <div className="space-y-4 text-white/90">
                        <div className="flex items-start space-x-3">
                          <Users className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                          <p>Add trusted contacts (family, friends, lawyers)</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <FileText className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                          <p>Upload your will and important documents</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                          <p>Configure Dead Man's Switch (optional)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:w-1/2 text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <Users className="h-24 w-24 text-cyan-400 mx-auto mb-4" />
                    <p className="text-white/80 text-lg">You control who receives your legacy and what they can access</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div 
                className={`flex flex-col lg:flex-row-reverse items-center gap-8 transition-all duration-800 ease-out ${
                  isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: '1100ms' }}
              >
                <div className="lg:w-1/2">
                  <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-xl font-bold text-white">2</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white">System Activation</h3>
                      </div>
                      <div className="space-y-4 text-white/90">
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                          <p>Dead Man's Switch monitors your activity</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Mail className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                          <p>System sends reminders before activation</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                          <p>Multiple safeguards prevent false triggers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:w-1/2 text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <Clock className="h-24 w-24 text-purple-400 mx-auto mb-4" />
                    <p className="text-white/80 text-lg">Automated monitoring with multiple safety checks</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div 
                className={`flex flex-col lg:flex-row items-center gap-8 transition-all duration-800 ease-out ${
                  isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: '1200ms' }}
              >
                <div className="lg:w-1/2">
                  <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-xl font-bold text-white">3</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white">Secure Access Codes</h3>
                      </div>
                      <div className="space-y-4 text-white/90">
                        <div className="flex items-start space-x-3">
                          <Key className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                          <p>Unique access codes generated for each heir</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Mail className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                          <p>Secure emails sent to trusted contacts</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Shield className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                          <p>Time-limited access for security</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:w-1/2 text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <Key className="h-24 w-24 text-green-400 mx-auto mb-4" />
                    <p className="text-white/80 text-lg">Cryptographically secure access codes ensure only intended recipients can access your legacy</p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div 
                className={`flex flex-col lg:flex-row-reverse items-center gap-8 transition-all duration-800 ease-out ${
                  isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: '1300ms' }}
              >
                <div className="lg:w-1/2">
                  <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-xl font-bold text-white">4</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white">Heir Access</h3>
                      </div>
                      <div className="space-y-4 text-white/90">
                        <div className="flex items-start space-x-3">
                          <Smartphone className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                          <p>Simple verification process - no account needed</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Download className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                          <p>Download wills, photos, and memories</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <FileText className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                          <p>Export all data in multiple formats</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:w-1/2 text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <Download className="h-24 w-24 text-yellow-400 mx-auto mb-4" />
                    <p className="text-white/80 text-lg">Your heirs can easily access and download your complete digital legacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dead Man's Switch Explanation */}
          <div className="mb-16">
            <Card 
              className={`backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transition-all duration-800 ease-out ${
                isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
              }`}
              style={{ transitionDelay: '1400ms' }}
            >
              <CardHeader>
                <h2 className="text-3xl font-serif font-bold text-white text-center">
                  What is a Dead Man's Switch?
                </h2>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">How It Works</h3>
                    <div className="space-y-3 text-white/90">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        <p>You set a check-in interval (e.g., every 30 days)</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        <p>System sends you reminder emails before deadline</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        <p>If you don't check in, legacy transfer begins</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        <p>Multiple warnings prevent accidental activation</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Safety Features</h3>
                    <div className="space-y-3 text-white/90">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                        <p>Grace period with multiple notifications</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                        <p>Easy reactivation if triggered accidentally</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                        <p>Pause feature for vacations or medical procedures</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                        <p>Manual override available anytime</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security & Privacy */}
          <div className="mb-16">
            <h2 
              className={`text-3xl font-serif font-bold text-white text-center mb-12 transition-all duration-800 ease-out ${
                isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'
              }`}
              style={{ transitionDelay: '1500ms' }}
            >
              Security & Privacy
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card 
                className={`backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transition-all duration-800 ease-out ${
                  isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: '1600ms' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-8 w-8 text-blue-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">Data Protection</h3>
                  </div>
                  <ul className="space-y-2 text-white/90">
                    <li>• End-to-end encryption for all data</li>
                    <li>• Bank-level security infrastructure</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Secure data centers with redundancy</li>
                  </ul>
                </CardContent>
              </Card>

              <Card 
                className={`backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transition-all duration-800 ease-out ${
                  isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: '1700ms' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Key className="h-8 w-8 text-green-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">Access Control</h3>
                  </div>
                  <ul className="space-y-2 text-white/90">
                    <li>• Unique access codes for each heir</li>
                    <li>• Time-limited access windows</li>
                    <li>• Audit trail of all access attempts</li>
                    <li>• Granular permission controls</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 
              className={`text-3xl font-serif font-bold text-white text-center mb-12 transition-all duration-800 ease-out ${
                isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'
              }`}
              style={{ transitionDelay: '1800ms' }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  question: "Do my heirs need to create accounts to access my legacy?",
                  answer: "No! Your heirs simply need the access code we send them. They'll verify their identity with basic information (name, email, relationship) and can immediately access your legacy. No account creation or complex signup process required.",
                  delay: '1900ms'
                },
                {
                  question: "What happens if I accidentally trigger the Dead Man's Switch?",
                  answer: "The system has multiple safeguards. You'll receive several warning emails before activation, and there's a grace period where you can easily reactivate your account. Even after activation, you can log in and pause the process.",
                  delay: '2000ms'
                },
                {
                  question: "Can I control what each heir can access?",
                  answer: "Yes! You can set different access levels for different heirs. Some might get full access to everything, while others might only see specific documents or memories. You have complete control over who sees what.",
                  delay: '2100ms'
                },
                {
                  question: "How secure are the access codes?",
                  answer: "Access codes are cryptographically generated and unique to each heir. They're sent via secure email and have optional expiration dates. Each code can only be used by the intended recipient and includes verification steps.",
                  delay: '2200ms'
                },
                {
                  question: "What formats can my heirs download my data in?",
                  answer: "Your heirs can download individual documents (PDFs, text files), complete data exports (JSON format), and formatted versions for printing. Wills can be downloaded as legal documents, and photos maintain their original quality.",
                  delay: '2300ms'
                }
              ].map((faq, index) => (
                <Card 
                  key={index}
                  className={`backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl transition-all duration-800 ease-out ${
                    isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                  }`}
                  style={{ transitionDelay: faq.delay }}
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-white/90">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div 
            className={`text-center transition-all duration-800 ease-out ${
              isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}
            style={{ transitionDelay: '2400ms' }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
              <CardContent>
                <h2 className="text-3xl font-serif font-bold text-white mb-6">
                  Ready to Preserve Your Legacy?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of families who trust Digital Legacy Diary to preserve their memories and ensure their final wishes are honored.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl text-white font-semibold"
                    >
                      {/* Responsive button text - shorter on mobile, full on larger screens */}
                      <span className="block sm:hidden">Start Today</span>
                      <span className="hidden sm:block">Start Your Legacy Today</span>
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-8 transform transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      {/* Responsive button text */}
                      <span className="block sm:hidden">Questions?</span>
                      <span className="hidden sm:block">Have Questions?</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default HowItWorksPage;