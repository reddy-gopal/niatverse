import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ThumbsUp, Edit3, Clock, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { campuses, allArticles, articleComments, relatedArticles } from '../data/mockData';
import { CATEGORY_CONFIG } from '../data/articleCategories';

export default function Article() {
  const { id, articleId } = useParams<{ id?: string; articleId: string }>();
  const isGlobalRoute = !id;
  const campusId = id ? parseInt(id, 10) : null;
  const articleIdNum = parseInt(articleId || '1', 10);

  const pageArticle = allArticles.find((a) => a.id === articleIdNum);
  const campus = campusId ? campuses.find((c) => c.id === campusId) || null : null;

  const article = pageArticle
    ? {
        title: pageArticle.title,
        excerpt: pageArticle.excerpt,
        updatedDays: pageArticle.updatedDays,
        helpful: pageArticle.helpful,
        author: 'NIAT Student',
        category: pageArticle.category,
        campusName: pageArticle.campusName,
      }
    : {
        title: 'Article not found',
        excerpt: '',
        updatedDays: 0,
        helpful: 0,
        author: 'NIAT Student',
        category: 'irc' as const,
        campusName: 'Global',
      };

  const categoryConfig = CATEGORY_CONFIG[article.category];
  const [showEditHistory, setShowEditHistory] = useState(false);

  const relatedLinkBase = isGlobalRoute || !campusId
    ? (rid: number) => `/article/${rid}`
    : (rid: number) => `/campus/${campusId}/article/${rid}`;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-black text-sm mb-6 flex-wrap gap-1">
          <Link to="/" className="hover:text-[#991b1b]">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          {isGlobalRoute ? (
            <>
              <Link to="/articles" className="hover:text-[#991b1b]">Articles</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
            </>
          ) : (
            <>
              <Link to={`/campus/${campusId}`} className="hover:text-[#991b1b]">
                {campus?.name ?? 'Campus'}
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
            </>
          )}
          <span
            className="truncate max-w-xs"
            style={{ color: categoryConfig?.text ?? '#991b1b' }}
          >
            {categoryConfig?.label ?? 'Article'}
          </span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-black truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Category Pills */}
        <div className="flex gap-2 mb-4">
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              backgroundColor: categoryConfig?.bg ?? '#fbf2f3',
              color: categoryConfig?.text ?? '#991b1b',
              border: `1px solid ${categoryConfig?.border ?? '#991b1b'}`,
            }}
          >
            {categoryConfig?.label ?? 'IRC & Skills'}
          </span>
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={
              article.campusName === 'Global'
                ? { backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #94a3b8' }
                : { backgroundColor: '#991b1b', color: 'white', border: '1px solid #991b1b' }
            }
          >
            {article.campusName}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="font-display text-2xl md:text-4xl font-bold text-black mb-4">
          {article.title}
        </h1>

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-black mb-8 pb-6 border-b border-[rgba(30,41,59,0.1)]">
          <span>Written by {article.author}</span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Last updated {article.updatedDays} days ago
          </span>
          <span className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" />
            {article.helpful} students found this helpful
          </span>
        </div>

        {/* Article Body */}
        <article className="prose prose-lg max-w-none mb-8">
          <p className="text-black leading-relaxed mb-6">
            The IRC (Industry Readiness Course) submission process at St. Mary's can feel overwhelming 
            at first. The official documentation is sparse, and every coordinator seems to have their 
            own interpretation of the rules. After going through this twice and helping dozens of 
            juniors, here's what actually works.
          </p>

          <h2 className="font-display text-xl md:text-2xl font-bold text-black mt-8 mb-4">
            The Official Process (What NIAT Says)
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-black mb-6">
            <li>Register your project idea on the NIAT portal within the first month</li>
            <li>Get mentor approval within 2 weeks of registration</li>
            <li>Submit weekly progress reports every Friday</li>
            <li>Present your final project in the evaluation week</li>
          </ol>

          <h2 className="font-display text-xl md:text-2xl font-bold text-black mt-8 mb-4">
            What Actually Happens (What Students Know)
          </h2>
          <p className="text-black leading-relaxed mb-4">
            In reality, the process has a few unwritten rules that can make or break your timeline. 
            The portal is notorious for going down during the last week of every month — plan your 
            submissions for the middle of the month if possible.
          </p>
          <p className="text-black leading-relaxed mb-6">
            Mentor availability is another bottleneck. Most mentors are full-time faculty with their 
            own research and teaching commitments. The best time to catch them is during their office 
            hours (usually posted on the department notice board) or right after their classes.
          </p>

          <div className="bg-[#fbf2f3] border-l-4 border-[#991b1b] p-4 mb-6">
            <p className="text-sm text-black">
              <span className="font-medium">Pro tip:</span> Book your lab slot for the entire semester 
              in the first week. The good slots (mornings, when mentors are fresh) fill up fast.
            </p>
          </div>

          <h2 className="font-display text-xl md:text-2xl font-bold text-black mt-8 mb-4">
            The 3-Week Delay Trap
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <span className="text-amber-600 mr-2">⚠️</span>
              <div>
                <p className="font-medium text-amber-800 mb-1">Warning</p>
                <p className="text-sm text-amber-700">
                  The most common delay happens when students wait for mentor feedback before proceeding. 
                  Don't wait — keep working on parallel tracks while waiting for approvals. The mentors 
                  appreciate students who show initiative.
                </p>
              </div>
            </div>
          </div>

          <h2 className="font-display text-xl md:text-2xl font-bold text-black mt-8 mb-4">
            Timeline from Start to Finish
          </h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fbf2f3]">
                  <th className="text-left p-3 font-medium text-black">Phase</th>
                  <th className="text-left p-3 font-medium text-black">Duration</th>
                  <th className="text-left p-3 font-medium text-black">Key Milestone</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[rgba(30,41,59,0.1)]">
                  <td className="p-3 text-black">Ideation</td>
                  <td className="p-3 text-black">Week 1-2</td>
                  <td className="p-3 text-black">Project idea finalized</td>
                </tr>
                <tr className="border-b border-[rgba(30,41,59,0.1)]">
                  <td className="p-3 text-black">Registration</td>
                  <td className="p-3 text-black">Week 3</td>
                  <td className="p-3 text-black">Portal registration complete</td>
                </tr>
                <tr className="border-b border-[rgba(30,41,59,0.1)]">
                  <td className="p-3 text-black">Development</td>
                  <td className="p-3 text-black">Week 4-16</td>
                  <td className="p-3 text-black">Weekly progress reports</td>
                </tr>
                <tr>
                  <td className="p-3 text-black">Evaluation</td>
                  <td className="p-3 text-black">Week 17-18</td>
                  <td className="p-3 text-black">Final presentation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        {/* Helpful / Edit Strip */}
        <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-[rgba(30,41,59,0.1)]">
          <button className="btn-secondary flex items-center">
            <ThumbsUp className="h-4 w-4 mr-2" />
            {article.helpful} students found this helpful
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-50 transition-colors">
            <Edit3 className="h-4 w-4 mr-2" />
            Suggest an Edit
          </button>
        </div>

        {/* Discussion Section */}
        <section className="mb-8">
          <h3 className="font-display text-xl font-bold text-black mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Discussion ({articleComments.length} comments)
          </h3>
          
          <div className="space-y-4 mb-6">
            {articleComments.map((comment) => (
              <div key={comment.id} className="bg-section rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-black">{comment.author}</span>
                  <span className="text-xs text-black">{comment.date}</span>
                </div>
                <p className="text-sm text-black">{comment.content}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-black mb-2">Join the discussion...</p>
            <p className="text-xs text-black">Login required to comment</p>
          </div>
        </section>

        {/* Related Articles */}
        <section className="mb-8">
          <h3 className="font-display text-xl font-bold text-black mb-4">
            Related Articles
          </h3>
          <div className="space-y-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                to={relatedLinkBase(related.id)}
                className="block bg-white rounded-lg shadow-soft p-4 hover:shadow-card transition-shadow"
              >
                <h4 className="font-medium text-black mb-1">{related.title}</h4>
                <div className="flex items-center text-xs text-black">
                  <span className="flex items-center mr-3">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated {related.updatedDays} days ago
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {related.helpful} helpful
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Edit History */}
        <section>
          <button
            onClick={() => setShowEditHistory(!showEditHistory)}
            className="text-sm text-[#991b1b] hover:underline"
          >
            View edit history (3 edits)
          </button>
          
          {showEditHistory && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <ul className="text-sm text-black space-y-2">
                <li>• Jan 15, 2026 — Updated lab timings (Kiran T.)</li>
                <li>• Jan 10, 2026 — Added timeline table (Kiran T.)</li>
                <li>• Jan 5, 2026 — Initial version (Kiran T.)</li>
              </ul>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
