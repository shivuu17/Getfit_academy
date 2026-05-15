const l = require('./node_modules/lucide-react');
const needed = ['Instagram','Youtube','Twitter','Share2','Menu','X','Check','Phone','MessageCircle','MapPin','Clock'];
needed.forEach(n => {
  console.log(n, n in l ? 'OK' : 'MISSING');
});
